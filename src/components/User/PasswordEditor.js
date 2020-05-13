import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, ButtonGroup, Card, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as userActions } from 'redux/reducers/user';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { composeValidators, length, matches, required } from 'utils/validation';

export class PasswordEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'password', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'password', status: false });
    actions.updatePassword(values);
  }

  setDate(date, time) {
    return new Date(`${date} ${time}`);
  }

  render() {
    const { user } = this.props;

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">Edit Password</Card.Header>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Row>
                    <Field
                      name="password"
                      validate={composeValidators(required, length(8))}
                    >
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="6">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            {...input}
                            type="password"
                            placeholder="Enter Password"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error === 'required' && (
                            <Form.Control.Feedback type="invalid">
                              Please enter a password
                            </Form.Control.Feedback>
                          )}
                          {meta.touched && meta.error === 'min-length' && (
                            <Form.Control.Feedback type="invalid">
                              Password must be at least 8 characters
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                    <Field
                      name="passwordConfirm"
                      validate={composeValidators(
                        required,
                        matches('password')
                      )}
                    >
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="6">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            {...input}
                            type="password"
                            placeholder="Confirm Password"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error === 'required' && (
                            <Form.Control.Feedback type="invalid">
                              Please re-enter your password
                            </Form.Control.Feedback>
                          )}
                          {meta.touched && meta.error === 'matches' && (
                            <Form.Control.Feedback type="invalid">
                              Please ensure both passwords match
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row className="mt-3">
                    <Form.Group>
                      <ButtonGroup>
                        <Button
                          variant="outline-success"
                          type="submit"
                          disabled={submitting}
                        >
                          <FontAwesomeIcon icon={['far', 'save']} size="lg" />
                          &nbsp;<span>Save</span>
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => this.hideEditor()}
                        >
                          <FontAwesomeIcon icon={['fas', 'ban']} size="lg" />
                          &nbsp;<span>Cancel</span>
                        </Button>
                      </ButtonGroup>
                    </Form.Group>
                  </Form.Row>
                  {user?.privileges?.ui_debug && (
                    <Fragment>
                      Debug: <pre>{JSON.stringify(values, 0, 2)}</pre>
                    </Fragment>
                  )}
                </Form>
              )}
            />
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...userActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordEditor);
