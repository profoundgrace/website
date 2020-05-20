import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { Form as FinalForm, Field } from 'react-final-form';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { composeValidators, required } from 'utils/validation';

export class TopicEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    topicForum: PropTypes.object,
    topic: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };
  static defaultProps = {
    topicForum: {},
    topic: {}
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'topic', status: false });
    actions.displayEditor({ editor: 'topics', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;
    const { update } = values;
    actions.displayEditor({ editor: 'topic', status: false });
    actions.displayEditor({ editor: 'topics', status: false });
    actions.addTopic(values);
    if (!update) {
      actions.metaAddTopic({ forum: values.forum });
    }
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
    const { topicForum, topic, user } = this.props;

    const {
      _key,
      createdDate,
      forum,
      rating,
      replies,
      text,
      title,
      userId,
      views
    } = topic;

    const update = Boolean(topic?._key);

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">
            {!update ? `Add New Topic` : `Edit ${topic.title}`}
          </Card.Header>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                _key: _key || null,
                createdDate: createdDate || null,
                forum: forum || topicForum._key,
                rating: rating || 0,
                replies: replies || 0,
                text: text || null,
                title: title || null,
                userId: userId || user.id,
                views: views || 0,
                update
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Row>
                    <Field name="title" validate={composeValidators(required)}>
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="4" sm="12">
                          <Form.Label>Topic Title</Form.Label>
                          <Form.Control
                            {...input}
                            type="text"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please Enter an Topic Title
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="text" validate={composeValidators(required)}>
                      {({ input, meta }) => (
                        <Form.Group as={Col} sm="12" md="4">
                          <Form.Label>
                            Topic Text{' '}
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={this.textInfo}
                            >
                              <FontAwesomeIcon
                                className="text-info"
                                icon={['fas', 'info-circle']}
                                size="1x"
                              />
                            </OverlayTrigger>
                          </Form.Label>
                          <Form.Control
                            {...input}
                            as="textarea"
                            rows="10"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please Enter Topic Text
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <h6>Preview:</h6>
                  <Form.Row>
                    <Col
                      sm="12"
                      md="4"
                      className="p-3 border border-light text-break"
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
                    <Field name="replies">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
                    </Field>
                    <Field name="views">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
                    </Field>
                    <Field name="rating">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
                    </Field>
                    <Field name="forum">
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
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...forumActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicEditor);
