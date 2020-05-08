import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, ButtonGroup, Card, Col, Form, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as pubActions } from 'redux/reducers/publication';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { composeValidators, required } from 'utils/validation';

export class PublicationEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    publication: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };
  static defaultProps = {
    publication: {}
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'publication', status: false });
    actions.displayEditor({ editor: 'publications', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'publication', status: false });
    actions.displayEditor({ editor: 'publications', status: false });
    actions.createPub(values);
  }

  get timeInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Time</Popover.Title>
        <Popover.Content>
          Times are manually typed in the format: hh:mm am/pm.
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    const { publication, user } = this.props;

    const { _key, description, name, title } = publication;

    const update = Boolean(publication?._key);

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">
            {!update ? `Add New Publication` : `Edit ${publication.title}`}
          </Card.Header>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                _key: _key || null,
                description: description || null,
                name: name || null,
                title: title || null,
                update
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Row>
                    <Field name="name" validate={composeValidators(required)}>
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="2" sm="4">
                          <Form.Label>Unique Name</Form.Label>
                          <Form.Control
                            {...input}
                            type="text"
                            placeholder="e.g. annoucements"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please Enter a Unique Name
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="title" validate={composeValidators(required)}>
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="2" sm="4">
                          <Form.Label>Publication Title</Form.Label>
                          <Form.Control
                            {...input}
                            type="text"
                            placeholder="e.g. Announcements"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please Enter a Publication Title
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="description">
                      {({ input, meta }) => (
                        <Form.Group as={Col} sm="6" md="4">
                          <Form.Group>
                            <Form.Label>Publication Description</Form.Label>
                            <Form.Control
                              {...input}
                              as="textarea"
                              placeholder="Description: e.g. purpose, audience, and/or category of topics"
                              isInvalid={meta.error && meta.touched}
                            />
                            {meta.touched && meta.error && (
                              <Form.Control.Feedback type="invalid">
                                Please Enter a Publication Description
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="_key">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
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
      ...pubActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicationEditor);
