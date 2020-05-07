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
import { actions as roleActions } from 'redux/reducers/role';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getRoles } from 'redux/selectors/role';
import RoleEditor from 'components/Roles/RoleEditor';
import RolePrivilegesEditor from 'components/Roles/RolePrivilegesEditor';
import RoleUsersEditor from 'components/Roles/RoleUsersEditor';

export class AdminRoles extends Component {
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
    this.state = { links: [], active: 'Roles' };
    this.roleEditor = this.roleEditor.bind(this);
    this.rolesEditor = this.rolesEditor.bind(this);
    this.rolePrivilegesEditor = this.rolePrivilegesEditor.bind(this);
    this.roleUsersEditor = this.roleUsersEditor.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.requestRoles();
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'roles', status: false });
    actions.displayEditor({ editor: 'role', status: false });
    actions.displayEditor({ editor: 'rolePrivileges', status: false });
    actions.displayEditor({ editor: 'roleUsers', status: false });
  }

  rolesEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'roles',
      status: !displayEditor.roles
    });
  }

  roleEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'role', status: _key });
  }

  rolePrivilegesEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'rolePrivileges', status: _key });
  }

  roleUsersEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'roleUsers', status: _key });
  }

  render() {
    const { collection, displayEditor, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid>
        <Helmet title="Roles" />
        <h1>Administration</h1>
        <Breadcrumbs base={null} links={links} active={active} />
        <h2>Roles</h2>
        {user?.privileges?.roles_update && !displayEditor?.roles && (
          <Button
            variant="primary"
            size="sm"
            className="mr-2 mt-2 rounded-pill"
            onClick={() => this.rolesEditor()}
            title={`Add Role`}
          >
            <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
            &nbsp; Add
          </Button>
        )}
        {user?.privileges?.roles_update && displayEditor?.roles === true && (
          <RoleEditor />
        )}
        <Row className="mt-3">
          <Col>
            {collection ? (
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr className="text-center">
                    <th>Options</th>
                    <th>Role</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {collection &&
                    collection?.map &&
                    collection.map((role, index) => {
                      const { _key, name, description } = role;

                      return (
                        <Fragment key={`roles_${_key}`}>
                          <tr>
                            <td className="text-center">
                              {user?.privileges?.roles_update && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="mr-3 rounded-circle"
                                  onClick={() => this.roleEditor(_key)}
                                  title={`Edit ${name}`}
                                >
                                  <FontAwesomeIcon
                                    icon={['fas', 'edit']}
                                    size="1x"
                                  />
                                </Button>
                              )}
                              {user?.privileges?.role_privileges_update && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="mr-3 rounded-circle"
                                  onClick={() =>
                                    this.rolePrivilegesEditor(_key)
                                  }
                                  title={`Add or Remove Privileges for ${name}`}
                                >
                                  <FontAwesomeIcon
                                    icon={['fas', 'key']}
                                    size="1x"
                                  />
                                </Button>
                              )}
                              {user?.privileges?.role_users_update && (
                                <Button
                                  variant="info"
                                  size="sm"
                                  className="mr-3 rounded-circle"
                                  onClick={() => this.roleUsersEditor(_key)}
                                  title={`Add or Remove ${name} Users`}
                                >
                                  <FontAwesomeIcon
                                    icon={['fas', 'user-shield']}
                                    size="1x"
                                  />
                                </Button>
                              )}
                            </td>
                            <td className="text-center">{name}</td>
                            <td>{description}</td>
                          </tr>
                          {displayEditor?.role === _key && (
                            <tr>
                              <td colSpan="7">
                                <RoleEditor role={role} />
                              </td>
                            </tr>
                          )}
                          {displayEditor?.rolePrivileges === _key && (
                            <tr>
                              <td colSpan="7">
                                <RolePrivilegesEditor role={role} />
                              </td>
                            </tr>
                          )}
                          {displayEditor?.roleUsers === _key && (
                            <tr>
                              <td colSpan="7">
                                <RoleUsersEditor role={role} />
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                </tbody>
              </Table>
            ) : (
              'No Roles are available'
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
  collection: getRoles(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...roleActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRoles);
