import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Button, Container, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getForums } from 'redux/selectors/forum';
import DeleteForumEditor from 'components/Forum/DeleteForumEditor';
import ForumEditor from 'components/Forum/ForumEditor';

export class AdminForum extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = { links: [{ name: 'Admin', url: '/admin' }], active: 'Forum' };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.requestForums({ parent: null });
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'deleteForum', status: false });
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

  deleteForumEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteForum', status: _key });
  }

  render() {
    const { collection, displayEditor, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid>
        <Helmet title="Forum Admin" />
        <h1>Administration</h1>
        <Breadcrumbs base={null} links={links} active={active} />
        <h2>Forum Admin</h2>
        {user?.privileges?.forums_update && !displayEditor?.forums && (
          <Button
            size="sm"
            className="mr-2 mt-2 rounded-pill"
            onClick={() => this.forumsEditor()}
            title={`Create a New Forum`}
          >
            <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
            &nbsp; Add a Forum
          </Button>
        )}
        {user?.privileges?.forums_update && displayEditor?.forums === true && (
          <ForumEditor />
        )}
        <Row className="mt-3">
          {user?.privileges?.forums_view &&
          collection &&
          collection?.map &&
          collection.length > 0 ? (
            <Table responsive striped bordered hover size="sm">
              <thead>
                <tr className="text-center">
                  <th>Options</th>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Name</th>
                  <th>Parent</th>
                  <th>Topics</th>
                  <th>Replies</th>
                </tr>
              </thead>
              <tbody>
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

                  let { parent } = forum;

                  if (parent === null) {
                    parent = 'Top-Level';
                  }

                  return (
                    <Fragment key={`forums_${_key}`}>
                      <tr>
                        <td className="text-center">
                          {user?.privileges?.forums_update && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="mr-2 rounded-circle"
                              onClick={() => this.forumEditor(_key)}
                              title={`Edit ${title}`}
                            >
                              <FontAwesomeIcon
                                icon={['fas', 'edit']}
                                size="1x"
                              />
                            </Button>
                          )}{' '}
                          {user?.privileges?.forums_delete && (
                            <Button
                              variant="danger"
                              size="sm"
                              className="mr-2 rounded-circle"
                              onClick={() => this.deleteForumEditor(_key)}
                              title={`Delete ${title}`}
                            >
                              <FontAwesomeIcon
                                icon={['fas', 'trash-alt']}
                                size="1x"
                              />
                            </Button>
                          )}
                        </td>
                        <td className="text-center">
                          <FontAwesomeIcon
                            icon={['fas', `${icon}`]}
                            size="lg"
                          />
                        </td>
                        <td className="text-center">{title}</td>
                        <td className="text-left">{description}</td>
                        <td className="text-center">{name}</td>
                        <td className="text-center">{parent}</td>
                        <td className="text-center">{topics}</td>
                        <td className="text-center">{replies}</td>
                      </tr>
                      {user?.privileges?.forums_update &&
                        displayEditor?.forum === _key && (
                          <tr>
                            <td colSpan="7">
                              <ForumEditor forum={forum} />
                            </td>
                          </tr>
                        )}
                      {user?.privileges?.forums_delete &&
                        displayEditor?.deleteForum === _key && (
                          <tr>
                            <td colSpan="8">
                              <DeleteForumEditor forum={forum} />
                            </td>
                          </tr>
                        )}
                    </Fragment>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <Container className="text-center">
              <h5>No Forums Available or Authorized</h5>
            </Container>
          )}
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  collection: getForums(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminForum);
