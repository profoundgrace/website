import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getForum, getForums, getTopics } from 'redux/selectors/forum';
import TopicEditor from 'components/Forum/TopicEditor';

export class ForumTopics extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    displayEditor: PropTypes.object,
    forum: PropTypes.object,
    forums: PropTypes.array,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    const {
      match: {
        params: { name },
      },
    } = this.props;

    this.state = { links: [{ name: 'Forum', url: '/forum' }], active: name };
  }

  componentDidMount() {
    const {
      actions,
      match: {
        params: { name },
      },
    } = this.props;
    if (name) {
      actions.requestForum({ name });
    }
    actions.requestForums({ parent: name });
    actions.requestForumTopics({ name });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params !== prevProps.match.params) {
      const {
        actions,
        match: {
          params: { name },
        },
      } = this.props;
      if (name) {
        actions.requestForum({ name });
      }
      actions.requestForums({ parent: name });
      actions.requestForumTopics({ name });
    }
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'topic', status: false });
    actions.displayEditor({ editor: 'topics', status: false });
  }

  topicsEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'topics',
      status: !displayEditor.topics,
    });
  }

  topicEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'topic', status: _key });
  }

  displayDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }

  displayTime(date) {
    const formattedTime = new Date(date);
    return formattedTime.toLocaleTimeString('en-US');
  }

  render() {
    const { collection, displayEditor, forum, forums, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid className="pl-4 pr-4">
        <Helmet title={`${forum.title} Forum`} />
        <Breadcrumbs base={null} links={links} active={active} />
        <h2>{forum.title} Forum</h2>
        <Alert variant="info">
          {forum?.options?.adminOnly && (
            <Fragment>
              <FontAwesomeIcon
                icon={['fas', 'lock']}
                size="2x"
                className="text-light"
                title="Topics Locked to Admins Only"
              />
              &nbsp; &nbsp;
            </Fragment>
          )}
          {forum.description}
        </Alert>
        {user?.privileges?.view_forums &&
          forums &&
          forums?.map &&
          forums?.length > 0 && (
            <Fragment>
              {forums.map((subforum, index) => {
                const {
                  _key,
                  description,
                  icon,
                  name,
                  title,
                  topics,
                  replies,
                } = subforum;
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
                                      <h4 className="text-primary">{topics}</h4>
                                    </Col>
                                    <Col>
                                      <h5>Replies</h5>
                                      <h4 className="text-primary">
                                        {replies}
                                      </h4>
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
        {!displayEditor?.topics && (
          <Fragment>
            {!forum?.options?.adminOnly && user?.privileges?.create_topic && (
              <Button
                variant="success"
                size="sm"
                className="mr-3 mt-3 rounded-pill"
                onClick={() => this.topicsEditor()}
                title={`Create a New Topic`}
              >
                <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
                &nbsp; New Topic
              </Button>
            )}
            {forum?.options?.adminOnly &&
              user?.privileges?.create_topic_locked && (
                <Button
                  variant="success"
                  size="sm"
                  className="mr-3 mt-3 rounded-pill"
                  onClick={() => this.topicsEditor()}
                  title={`Create a New Topic`}
                >
                  <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
                  &nbsp; New Topic
                </Button>
              )}
          </Fragment>
        )}
        {user?.privileges?.update_forums && (
          <Button
            variant="primary"
            size="sm"
            className="mr-3 mt-3 rounded-pill"
            href="/#/admin/forum"
            title={`Forum Admin`}
          >
            <FontAwesomeIcon icon={['fas', 'th-list']} size="lg" />
            &nbsp; Forum Admin
          </Button>
        )}
        {user?.privileges?.create_topic && displayEditor?.topics === true && (
          <TopicEditor topicForum={forum} />
        )}
        {user?.privileges?.view_topics &&
        collection &&
        collection?.map &&
        collection.length > 0 ? (
          <Fragment>
            {collection.map((topic, index) => {
              const {
                _key,
                created,
                replies,
                title,
                updated,
                user,
                views,
              } = topic;
              return (
                <Row className="mt-3" key={`topics_${_key}`}>
                  <Col>
                    <Card>
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
                                <FontAwesomeIcon icon={['fas', 'align-left']} />
                              </span>
                            </Col>
                            <Col
                              className="mt-auto mb-auto"
                              sm="8"
                              md="6"
                              lg="8"
                            >
                              <Card.Title>
                                <Link to={`/forum/${forum.name}/${_key}`}>
                                  {title}
                                </Link>
                              </Card.Title>
                              <Card.Text>
                                by {user.name.first} {user.name.last} »{' '}
                                {this.displayDate(created)} »{' '}
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
                            </Col>
                            <Col>
                              <Container fluid>
                                <Row>
                                  <Col>
                                    <h5>Views</h5>
                                    <h4 className="text-primary">{views}</h4>
                                  </Col>
                                  <Col>
                                    <h5>Replies</h5>
                                    <h4 className="text-primary">{replies}</h4>
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
        ) : (
          <Container className="mt-3 text-center" fluid>
            <Row>
              <Col>
                <Card>
                  <h5 className="mt-1">No Topics Have Been Posted</h5>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  collection: getTopics(state),
  displayEditor: getEditorStatus(state),
  forum: getForum(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(ForumTopics);
