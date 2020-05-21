import MD5 from 'md5.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import {
  getForum,
  getForumLoading,
  getTopic,
  getComments
} from 'redux/selectors/forum';
import CommentEditor from 'components/Forum/CommentEditor';
import DeleteCommentEditor from 'components/Forum/DeleteCommentEditor';
import DeleteTopicEditor from 'components/Forum/DeleteTopicEditor';
import TopicEditor from 'components/Forum/TopicEditor';
import Loading from 'components/Loading';

export class ForumTopic extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    displayEditor: PropTypes.object,
    forum: PropTypes.object,
    loading: PropTypes.bool,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    topic: PropTypes.object,
    user: PropTypes.object
  };
  constructor(props) {
    super(props);

    this.state = {
      links: [{ name: 'Forum', url: '/forum' }]
    };
  }

  componentDidMount() {
    const {
      actions,
      match: {
        params: { name, topic }
      }
    } = this.props;

    actions.requestForum({ name });
    actions.requestTopic({ _key: topic });
    actions.requestTopicComments({ _key: topic });
    actions.metaAddView({ topic });
  }

  disableEditors() {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteComment', status: false });
    actions.displayEditor({ editor: 'comment', status: false });
    actions.displayEditor({ editor: 'comments', status: false });
    actions.displayEditor({ editor: 'deleteTopic', status: false });
    actions.displayEditor({ editor: 'topic', status: false });
  }

  commentsEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'comments',
      status: !displayEditor.comments
    });
  }

  commentEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'comment', status: _key });
  }

  deleteCommentEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteComment', status: _key });
  }

  topicEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'topic', status: _key });
  }

  deleteTopicEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteTopic', status: _key });
  }

  displayDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }

  displayTime(date) {
    const formattedTime = new Date(date);
    return formattedTime.toLocaleTimeString('en-US');
  }

  gravatar(email) {
    const hash = new MD5().update(email).digest('hex');

    return `https://www.gravatar.com/avatar/${hash}?s=100`;
  }

  render() {
    const {
      collection,
      displayEditor,
      forum,
      loading,
      topic,
      user
    } = this.props;

    const {
      match: {
        params: { name }
      }
    } = this.props;

    if (!topic) {
      return <Redirect to={`/forum/${name}`} />;
    }

    let { links } = this.state;
    links = [...links, { name: forum?.title, url: `/forum/${forum?.name}` }];
    const topicUser = this.props.topic.user;

    const { _key, created, email, title, text, userId, updated } = topic;

    return (
      <Container fluid>
        <Helmet title={`${forum.title} Forum`} />
        <h1>Forum</h1>
        {!loading ? (
          <Fragment>
            <Breadcrumbs base={null} links={links} active={topic.title} />
            <h2>{forum.title} Forum</h2>
            <Alert variant="info">{forum.description}</Alert>
            {user?.privileges?.forums_update && (
              <Button
                variant="primary"
                size="sm"
                className="mr-2 mt-2 rounded-pill"
                href="/admin/forum"
                title={`Forum Admin`}
              >
                <FontAwesomeIcon icon={['fas', 'th-list']} size="lg" />
                &nbsp; Forum Admin
              </Button>
            )}
            <Row className="mt-3">
              <Col>
                <Card>
                  {topic && (
                    <Fragment>
                      <Card.Body>
                        <Card.Header as="h3">
                          {title}{' '}
                          {user?.privileges?.forum_topics_update &&
                            userId === user.id && (
                              <Button
                                variant="success"
                                size="sm"
                                className="mr-2 rounded-circle float-right"
                                onClick={() => this.topicEditor(_key)}
                                title={`Edit Topic ${title}`}
                              >
                                <FontAwesomeIcon
                                  icon={['fas', 'edit']}
                                  size="1x"
                                />
                              </Button>
                            )}{' '}
                          {user?.privileges?.forum_topics_delete && (
                            <Button
                              variant="danger"
                              size="sm"
                              className="mr-2 rounded-circle float-right"
                              onClick={() => this.deleteTopicEditor(_key)}
                              title={`Delete Topic ${title}`}
                            >
                              <FontAwesomeIcon
                                icon={['fas', 'trash-alt']}
                                size="1x"
                              />
                            </Button>
                          )}
                        </Card.Header>
                        <Container fluid>
                          <Row>
                            <Col
                              className="border border-secondary"
                              sm="8"
                              md="6"
                              lg="8"
                            >
                              <Card.Text>
                                by{' '}
                                {topicUser?.profile?.name
                                  ? topicUser?.profile?.name
                                  : topicUser?.username}{' '}
                                » {this.displayDate(created)} »{' '}
                                {this.displayTime(created)}
                                {updated && (
                                  <Fragment>
                                    {' '}
                                    « Updated: {this.displayDate(
                                      updated
                                    )} « {this.displayTime(updated)}
                                  </Fragment>
                                )}
                              </Card.Text>
                              <div className="mb-3 text-break">
                                {
                                  unified()
                                    .use(parse)
                                    .use(remark2react)
                                    .processSync(text).result
                                }
                              </div>
                            </Col>
                            <Col className="border border-secondary">
                              <Container fluid>
                                <Row>
                                  <Col>
                                    {email && (
                                      <img
                                        src={this.gravatar(email)}
                                        alt="Gravatar"
                                      />
                                    )}
                                    <p className="font-weight-bold text-primary">
                                      {topicUser?.profile?.name
                                        ? topicUser?.profile?.name
                                        : topicUser?.username}
                                    </p>
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                          </Row>
                        </Container>
                      </Card.Body>
                      {user?.privileges?.forum_topics_update &&
                        userId === user.id &&
                        displayEditor?.topic === _key && (
                          <TopicEditor topicForum={forum} topic={topic} />
                        )}
                      {user?.privileges?.forum_topics_delete &&
                        displayEditor?.deleteTopic === _key && (
                          <DeleteTopicEditor topicForum={forum} topic={topic} />
                        )}
                    </Fragment>
                  )}
                </Card>
              </Col>
            </Row>
            {user?.privileges?.forum_topics_create && !displayEditor?.comments && (
              <Button
                variant="success"
                size="sm"
                className="mr-2 mt-2 rounded-pill"
                onClick={() => this.commentsEditor()}
                title={`Create a New Reply`}
              >
                <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
                &nbsp; New Reply
              </Button>
            )}
            {user?.privileges?.forum_comments_create &&
              displayEditor?.comments === true && (
                <CommentEditor topic={topic} />
              )}
            {user?.privileges?.forum_comments_view &&
            collection &&
            collection?.map &&
            collection.length > 0 ? (
              <Row className="mt-3">
                <Col>
                  <Card>
                    {collection.map((comment, index) => {
                      const {
                        _key,
                        created,
                        email,
                        text,
                        updated,
                        userId
                      } = comment;
                      const cUser = comment.user;
                      let officeSymbol;
                      if (!cUser?.section) {
                        if (!cUser?.flight) {
                          officeSymbol = cUser?.org;
                        } else {
                          officeSymbol = cUser?.flight;
                        }
                      } else {
                        officeSymbol = cUser?.section;
                      }
                      return (
                        <Fragment key={`comments_${_key}`}>
                          <Card.Body>
                            <Card.Header>
                              RE: {title}{' '}
                              {user?.privileges?.forum_comments_update &&
                                userId === user.id && (
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="mr-2 rounded-circle float-right"
                                    onClick={() => this.commentEditor(_key)}
                                    title={`Edit Comment ${title}`}
                                  >
                                    <FontAwesomeIcon
                                      icon={['fas', 'edit']}
                                      size="1x"
                                    />
                                  </Button>
                                )}{' '}
                              {user?.privileges?.forum_comments_delete && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="mr-2 rounded-circle float-right"
                                  onClick={() => this.deleteCommentEditor(_key)}
                                  title={`Delete Comment ${title}`}
                                >
                                  <FontAwesomeIcon
                                    icon={['fas', 'trash-alt']}
                                    size="1x"
                                  />
                                </Button>
                              )}
                            </Card.Header>
                            <Container fluid>
                              <Row>
                                <Col
                                  className="border border-secondary"
                                  sm="8"
                                  md="6"
                                  lg="8"
                                >
                                  <Card.Text>
                                    by{' '}
                                    {cUser?.profile?.name
                                      ? cUser?.profile?.name.first
                                      : cUser?.username}{' '}
                                    » {this.displayDate(created)} »{' '}
                                    {this.displayTime(created)}
                                    {updated && (
                                      <Fragment>
                                        {' '}
                                        « Updated: {this.displayDate(
                                          updated
                                        )} « {this.displayTime(updated)}
                                      </Fragment>
                                    )}
                                  </Card.Text>
                                  <div className="mb-3 text-break">
                                    {
                                      unified()
                                        .use(parse)
                                        .use(remark2react)
                                        .processSync(text).result
                                    }
                                  </div>
                                </Col>
                                <Col className="border border-secondary">
                                  <Container fluid>
                                    <Row>
                                      <Col>
                                        <img
                                          src={this.gravatar(email)}
                                          alt="Gravatar"
                                        />
                                        <p className="font-weight-bold text-primary">
                                          {cUser?.profile?.name
                                            ? cUser?.profile?.name
                                            : cUser?.username}
                                        </p>
                                        <p className="text-uppercase">
                                          {officeSymbol}
                                        </p>
                                      </Col>
                                    </Row>
                                  </Container>
                                </Col>
                              </Row>
                            </Container>
                          </Card.Body>
                          {user?.privileges?.forum_comments_update &&
                            userId === user.id &&
                            displayEditor?.comment === _key && (
                              <CommentEditor
                                topicForum={forum}
                                topic={topic}
                                comment={comment}
                              />
                            )}
                          {user?.privileges?.forum_comments_delete &&
                            displayEditor?.deleteComment === _key && (
                              <DeleteCommentEditor
                                topicForum={forum}
                                topic={topic}
                                comment={comment}
                              />
                            )}
                        </Fragment>
                      );
                    })}
                  </Card>
                </Col>
              </Row>
            ) : (
              <Container className="mt-3 text-center" fluid>
                <Row>
                  <Col>
                    <Card>
                      <h5 className="mt-1">No Replies Have Been Posted</h5>
                    </Card>
                  </Col>
                </Row>
              </Container>
            )}
          </Fragment>
        ) : (
          <Loading />
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  collection: getComments(state),
  displayEditor: getEditorStatus(state),
  forum: getForum(state),
  loading: getForumLoading(state),
  loggedIn: isLoggedIn(state),
  topic: getTopic(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(ForumTopic);
