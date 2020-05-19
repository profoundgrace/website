import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getForum, getForumLoading, getForums } from 'redux/selectors/forum';
import Loading from 'components/Loading';

export class Forum extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    displayEditor: PropTypes.object,
    forum: PropTypes.object,
    loading: PropTypes.bool,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = { links: [], active: 'Forum' };
  }

  componentDidMount() {
    const {
      actions,
      match: {
        params: { name }
      }
    } = this.props;
    if (name) {
      actions.requestForum({ name });
    } else {
      actions.requestForums({ parent: 'main' });
    }
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'forum', status: false });
    actions.displayEditor({ editor: 'forums', status: false });
  }

  forumsEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'forums',
      status: !displayEditor.forums
    });
  }

  forumEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'forum', status: _key });
  }

  render() {
    const { collection, displayEditor, loading, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid>
        <Helmet title="Forum" />
        <h1>Forum</h1>
        {!loading ? (
          <Fragment>
            <Breadcrumbs base={null} links={links} active={active} />
            {user?.privileges?.forums_update && !displayEditor?.forums && (
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
            {user?.privileges?.forums_view &&
            collection &&
            collection?.map &&
            collection.length > 0 ? (
              <Fragment>
                {collection.map((forum, index) => {
                  const {
                    _key,
                    description,
                    icon,
                    name,
                    title,
                    topics,
                    replies
                  } = forum;
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
                                        <h4 className="text-primary">
                                          {topics}
                                        </h4>
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
            ) : (
              <Container className="text-center">
                <h5>No Forum Available or Authorized</h5>
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
  collection: getForums(state),
  displayEditor: getEditorStatus(state),
  forum: getForum(state),
  loading: getForumLoading(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(Forum);
