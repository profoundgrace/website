import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';

import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  InputGroup,
  Popover
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as userActions } from 'redux/reducers/user';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import {
  composeValidators,
  email,
  length,
  matches,
  required
} from 'utils/validation';

export class UserEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    account: PropTypes.object,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };
  static defaultProps = {
    account: {}
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'user', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'user', status: false });
    actions.updateUser(values);
  }

  setDate(date, time) {
    return new Date(`${date} ${time}`);
  }

  get textInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Markdown</Popover.Title>
        <Popover.Content>
          This content supports{' '}
          <a
            href="https://daringfireball.net/projects/markdown/syntax"
            target="_blank"
            rel="noopener noreferrer"
          >
            Markdown
          </a>
          , if you don't want to just use plain text.
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    const { account, user } = this.props;
    const { _key, email: emailAddress, username } = account;

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">Edit Account</Card.Header>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                _key: _key || null,
                username,
                email: emailAddress,
                emailAddressConfirm: emailAddress
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Row>
                    <Field
                      name="username"
                      validate={composeValidators(required, length(3, 50))}
                    >
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="4">
                          <Form.Label>Username</Form.Label>
                          <InputGroup>
                            <InputGroup.Prepend>
                              <InputGroup.Text id="inputGroupPrepend">
                                @
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                              {...input}
                              type="text"
                              placeholder={username}
                              aria-describedby="inputGroupPrepend"
                              isInvalid={meta.error && meta.touched}
                            />
                            {meta.touched && meta.error && (
                              <Form.Control.Feedback type="invalid">
                                {meta.error === 'required'
                                  ? 'Please enter a username'
                                  : 'Username must be between 3 and 50 characters'}
                              </Form.Control.Feedback>
                            )}
                          </InputGroup>
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field
                      name="email"
                      validate={composeValidators(required, email)}
                    >
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="6">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            {...input}
                            type="email"
                            placeholder="Enter email"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              {meta.error === 'required'
                                ? 'Please enter your email address'
                                : 'Please enter a valid email address'}
                            </Form.Control.Feedback>
                          )}
                          <Form.Text className="text-muted">
                            We&apos;ll never share your email with anyone else.
                          </Form.Text>
                        </Form.Group>
                      )}
                    </Field>
                    <Field
                      name="emailAddressConfirm"
                      validate={composeValidators(
                        required,
                        email,
                        matches('email')
                      )}
                    >
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="6" controlId="emailConf">
                          <Form.Label>Confirm Email Address</Form.Label>
                          <Form.Control
                            {...input}
                            type="email"
                            placeholder="Confirm Enter email"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error === 'required' && (
                            <Form.Control.Feedback type="invalid">
                              Please re-enter your email address
                            </Form.Control.Feedback>
                          )}
                          {meta.touched && meta.error === 'matches' && (
                            <Form.Control.Feedback type="invalid">
                              Please ensure both email addresses match
                            </Form.Control.Feedback>
                          )}
                          {meta.touched && meta.error === 'email' && (
                            <Form.Control.Feedback type="invalid">
                              Please enter a valid email address
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

export default connect(mapStateToProps, mapDispatchToProps)(UserEditor);
