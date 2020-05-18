import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, ButtonGroup, Card, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';

export class DeleteCommentEditor extends Component {
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
    actions.displayEditor({ editor: 'deleteComment', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteComment', status: false });
    actions.deleteComment(values);
    actions.metaDeleteComment({ topic: values.topic });
  }

  render() {
    const { comment, topic, user } = this.props;
    const { _key, forum, text } = comment;

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">{`Delete RE: ${topic.title}`}</Card.Header>
          <Card.Body>
            {text}
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                comment: _key || null,
                forum: forum || topic.forum,
                topic: topic._key,
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Field name="comment">
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
                  <Form.Row className="mt-3">
                    <Form.Group>
                      <ButtonGroup>
                        <Button
                          variant="outline-success"
                          type="submit"
                          disabled={submitting}
                        >
                          <FontAwesomeIcon
                            icon={['fas', 'trash-alt']}
                            size="lg"
                          />
                          &nbsp;<span>Delete</span>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteCommentEditor);
