import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getSubforums } from 'redux/selectors/forum';

export class DeleteForumEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    forum: PropTypes.object,
    subForums: PropTypes.array,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object,
  };
  static defaultProps = {
    forum: {},
  };

  constructor(props) {
    super(props);
    const {
      actions,
      forum: { name },
    } = this.props;
    actions.requestSubforums({ parent: name });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteForum', status: false });
    actions.displayEditor({ editor: 'forum', status: false });
    actions.displayEditor({ editor: 'forums', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteForum', status: false });
    actions.displayEditor({ editor: 'forum', status: false });
    actions.displayEditor({ editor: 'forums', status: false });
    actions.deleteForum(values);
  }

  render() {
    const { forum, subForums, user } = this.props;
    const { _key } = forum;

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">{`Delete Forum ${forum.title}`}</Card.Header>
          <Alert variant="danger" className="font-weight-bold">
            Deleting a forum is permanent: all topics and replies will also be
            deleted!
          </Alert>
          {subForums && subForums?.map && subForums?.length > 0 && (
            <Card.Body>
              <h3 className="text-danger">
                Oops: All Subforums Must Be Deleted First!
              </h3>
            </Card.Body>
          )}
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                forum: _key || null,
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Field name="forum">
                    {({ input, meta }) => (
                      <Form.Control {...input} type="hidden" />
                    )}
                  </Field>
                  <Form.Row>
                    <Form.Group>
                      <ButtonGroup>
                        <Button
                          variant="outline-success"
                          type="submit"
                          disabled={submitting || subForums?.length > 0}
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

            {subForums && subForums?.map && subForums.length > 0 && (
              <Fragment>
                <h3 className="text-danger">Subforums</h3>
                {subForums.map((subForum, index) => {
                  const {
                    _key,
                    description,
                    icon,
                    name,
                    title,
                    topics,
                    replies,
                  } = subForum;
                  return (
                    <Row className="mt-3">
                      <Col>
                        <Card key={`forums_${_key}`}>
                          <Card.Header>
                            <Link to={`/forum/${name}`}>{title}</Link>
                          </Card.Header>

                          <Card.Body>
                            <Container fluid>
                              <Row>
                                <Col
                                  className="mt-auto mb-auto"
                                  sm="auto"
                                  md="auto"
                                  lg="1"
                                >
                                  <span className="fa-layers fa-2x fa-fw">
                                    <FontAwesomeIcon
                                      icon={['fas', 'circle']}
                                      transform="grow-12"
                                      className="text-light"
                                    />
                                    <FontAwesomeIcon icon={['fas', icon]} />
                                  </span>
                                </Col>
                                <Col
                                  className="mt-auto mb-auto"
                                  sm="8"
                                  md="6"
                                  lg="8"
                                >
                                  {description}
                                </Col>
                                <Col>
                                  <Container fluid>
                                    <Row>
                                      <Col>
                                        <h5>Topics</h5>
                                        {topics}
                                      </Col>
                                      <Col>
                                        <h5>Replies</h5>
                                        {replies}
                                      </Col>
                                    </Row>
                                  </Container>
                                </Col>
                              </Row>
                            </Container>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  );
                })}
              </Fragment>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  displayEditor: getEditorStatus(state),
  subForums: getSubforums(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteForumEditor);
