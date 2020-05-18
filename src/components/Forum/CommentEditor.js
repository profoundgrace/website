import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Alert, Button, ButtonGroup, Card, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { composeValidators, required } from 'utils/validation';

export class CommentEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    comment: PropTypes.object,
    displayEditor: PropTypes.object,
    topic: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object,
  };
  static defaultProps = {
    comment: {},
    topic: {},
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'comment', status: false });
    actions.displayEditor({ editor: 'comments', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;
    const { update } = values;

    actions.displayEditor({ editor: 'comment', status: false });
    actions.displayEditor({ editor: 'comments', status: false });
    actions.addComment(values);
    if (!update) {
      actions.metaAddComment({ topic: values.topic });
    }
  }

  render() {
    const { comment, topic, user } = this.props;

    const { _key, createdDate, forum, text, userId } = comment;

    const update = Boolean(comment?._key);

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">
            {!update ? `Add New Reply` : `Edit RE: ${topic.title}`}
          </Card.Header>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                _key: _key || null,
                createdDate: createdDate || null,
                forum: forum || topic.forum,
                text: text || null,
                topic: topic._key,
                userId: userId || user.id,
                update,
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Row>
                    <Field name="text" validate={composeValidators(required)}>
                      {({ input, meta }) => (
                        <Form.Group as={Col} sm="12" md="4">
                          <Form.Group>
                            <Form.Label>Reply Text</Form.Label>
                            <Form.Control
                              {...input}
                              as="textarea"
                              rows="10"
                              isInvalid={meta.error && meta.touched}
                            />
                            {meta.touched && meta.error && (
                              <Form.Control.Feedback type="invalid">
                                Please Enter Reply Text
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Alert variant="light" className="text-primary">
                    <h6>
                      This forum supports{' '}
                      <a
                        href="https://daringfireball.net/projects/markdown/syntax"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Markdown
                      </a>
                      , if you don't want to just use plain text.
                    </h6>
                  </Alert>
                  <h6>Preview:</h6>
                  <Form.Row>
                    <Col
                      sm="12"
                      md="4"
                      className="p-3 border border-light text-break h5"
                    >
                      {
                        unified()
                          .use(parse)
                          .use(remark2react)
                          .processSync(values.text).result
                      }
                    </Col>
                    <Field name="_key">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
                    </Field>
                    <Field name="forum">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
                    </Field>
                    <Field name="topic">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
                    </Field>
                    <Field name="userId">
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentEditor);
