import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as userActions } from 'redux/reducers/user';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getUsers } from 'redux/selectors/user';
import UserEditor from 'components/Users/UserEditor';

export class AdminUsers extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    collection: PropTypes.array,
    user: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = { links: [], active: 'Users' };
    this.userEditor = this.userEditor.bind(this);
    this.usersEditor = this.usersEditor.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.requestUsers();
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'users', status: false });
    actions.displayEditor({ editor: 'user', status: false });
  }

  usersEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'users',
      status: !displayEditor.users
    });
  }

  userEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'user', status: _key });
  }

  render() {
    const { collection, displayEditor, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid>
        <Helmet title="Users" />
        <h1>Administration</h1>
        <Breadcrumbs base={null} links={links} active={active} />
        <h2>Users</h2>
        {user?.privileges?.users_update && !displayEditor?.users && (
          <Button
            variant="primary"
            size="sm"
            className="mr-2 mt-2 rounded-pill"
            onClick={() => this.usersEditor()}
            title={`Add User`}
          >
            <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
            &nbsp; Add
          </Button>
        )}
        {user?.privileges?.users_update && displayEditor?.users === true && (
          <UserEditor />
        )}
        <Row className="mt-3">
          <Col>
            {user?.privileges?.users_view && collection?.length > 0 ? (
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr className="text-center">
                    <th>Options</th>
                    <th>Personnel</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>DoD ID</th>
                  </tr>
                </thead>
                <tbody>
                  {collection &&
                    collection?.map &&
                    collection.map((User, index) => {
                      const { _key, name, username, email } = User;

                      return (
                        <Fragment key={`users_${_key}`}>
                          <tr>
                            <td className="text-center">
                              {user?.privileges?.users_update && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="mr-2 rounded-circle"
                                  onClick={() => this.userEditor(_key)}
                                  title={`Edit ${username}`}
                                >
                                  <FontAwesomeIcon
                                    icon={['fas', 'edit']}
                                    size="1x"
                                  />
                                </Button>
                              )}
                            </td>
                            <td className="text-center">
                              {name.first} {name.last}
                            </td>
                            <td className="text-center">{username}</td>
                            <td className="text-center">{email}</td>
                            <td className="text-center">{_key}</td>
                          </tr>
                          {user?.privileges?.users_update &&
                            displayEditor?.user === _key && (
                              <tr>
                                <td colSpan="7">
                                  <UserEditor User={user} />
                                </td>
                              </tr>
                            )}
                        </Fragment>
                      );
                    })}
                </tbody>
              </Table>
            ) : (
              'No Users are available'
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  collection: getUsers(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...userActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);
