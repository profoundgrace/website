import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, ButtonGroup, Card, Col, Form, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getForums } from 'redux/selectors/forum';
import { composeValidators, required } from 'utils/validation';

export class ForumEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    forum: PropTypes.object,
    forums: PropTypes.array,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    orgs: PropTypes.array,
    user: PropTypes.object,
    zones: PropTypes.array,
  };
  static defaultProps = {
    forum: {},
  };

  constructor(props) {
    super(props);
    const { actions } = this.props;
    actions.requestForums({ parent: null });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'forum', status: false });
    actions.displayEditor({ editor: 'forums', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'forum', status: false });
    actions.displayEditor({ editor: 'forums', status: false });
    actions.addForum(values);
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
    const { forum, forums, user } = this.props;

    const {
      _key,
      description,
      icon,
      name,
      options,
      parent,
      replies,
      title,
      topic,
    } = forum;

    const update = Boolean(forum?._key);

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">
            {!update ? `Add New Forum` : `Edit ${forum.title}`}
          </Card.Header>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                _key: _key || null,
                description: description || null,
                icon: icon || null,
                name: name || null,
                parent: parent == null ? 'main' : parent || null,
                replies: replies || 0,
                title: title || null,
                topics: topic || 0,
                ratings: options?.ratings || false,
                adminOnly: options?.adminOnly || false,
                update,
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Row>
                    <Field
                      name="parent"
                      component="select"
                      validate={composeValidators(required)}
                    >
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="2" sm="4">
                          <Form.Label>Parent Forum</Form.Label>
                          <Form.Control
                            as="select"
                            {...input}
                            isInvalid={meta.error && meta.touched}
                          >
                            <option value="">Select Parent Forum</option>
                            <option value="main">Top Level</option>
                            {forums.map((Forum, index) => {
                              return (
                                <option value={Forum._key} key={index}>
                                  {Forum.name}
                                </option>
                              );
                            })}
                          </Form.Control>
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please select an Parent
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
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
                          <Form.Label>Forum Title</Form.Label>
                          <Form.Control
                            {...input}
                            type="text"
                            placeholder="e.g. Announcements"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please Enter a Forum Title
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field
                      name="icon"
                      component="select"
                      validate={composeValidators(required)}
                    >
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="2" sm="4">
                          <Form.Label>Icon</Form.Label>
                          <Form.Control
                            as="select"
                            {...input}
                            isInvalid={meta.error && meta.touched}
                          >
                            <option value="null">Select Icon</option>
                            <option value="bullhorn">Bullhorn</option>
                            <option value="code">Code</option>
                            <option value="equals">Equals</option>
                            <option value="th-list">Generic</option>
                            <option value="info">Info</option>
                            <option value="lightbulb">Lightbulb</option>
                            <option value="newspaper">News</option>
                            <option value="question">Question</option>
                          </Form.Control>
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please select an Icon
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                    <Col md="1" sm="2" className="text-center mt-auto mb-auto">
                      {values?.icon ? (
                        <span className="fa-layers fa-2x fa-fw">
                          <FontAwesomeIcon
                            icon={['fas', 'circle']}
                            transform="grow-12"
                            className="text-light"
                          />
                          <FontAwesomeIcon icon={['fas', values?.icon]} />
                        </span>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Field name="description">
                      {({ input, meta }) => (
                        <Form.Group as={Col} sm="6" md="4">
                          <Form.Group>
                            <Form.Label>Forum Description</Form.Label>
                            <Form.Control
                              {...input}
                              as="textarea"
                              placeholder="Description: e.g. purpose, audience, and/or category of topics"
                              isInvalid={meta.error && meta.touched}
                            />
                            {meta.touched && meta.error && (
                              <Form.Control.Feedback type="invalid">
                                Please Enter a Forum Description
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="ratings" type="checkbox">
                      {({ input, meta }) => (
                        <Form.Group>
                          <Form.Label>Options</Form.Label>
                          <Form.Check
                            {...input}
                            type="switch"
                            label="Allow Topic Ratings"
                            id="options-rating"
                          />
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="adminOnly" type="checkbox">
                      {({ input, meta }) => (
                        <Form.Check
                          {...input}
                          type="switch"
                          label="Lock Forum Topics to Admin Only"
                          id="options-adminOnly"
                        />
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="_key">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
                    </Field>
                    <Field name="replies">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
                    </Field>
                    <Field name="topics">
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
  forums: getForums(state),
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...forumActions,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForumEditor);
