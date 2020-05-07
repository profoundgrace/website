import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as roleActions } from 'redux/reducers/role';
import { actions as userActions } from 'redux/reducers/user';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getRoleUsers } from 'redux/selectors/role';
import { getUsers } from 'redux/selectors/user';

export class RoleUsersEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    role: PropTypes.object,
    roleUsers: PropTypes.object,
    user: PropTypes.object,
    users: PropTypes.array,
  };
  static defaultProps = {
    role: {},
    roleUsers: [],
  };

  constructor(props) {
    super(props);
    this.addRoleUser = this.addRoleUser.bind(this);
    this.removeRoleUser = this.removeRoleUser.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  componentDidMount() {
    const { actions, role } = this.props;

    actions.requestRoleUsers({ role: role?._key });
    actions.requestUsers();
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'role', status: false });
    actions.displayEditor({ editor: 'roles', status: false });
    actions.displayEditor({ editor: 'roleUsers', status: false });
  }

  addRoleUser(roleUser) {
    const { actions } = this.props;

    actions.addRoleUser(roleUser);
  }

  removeRoleUser(roleUser) {
    const { actions } = this.props;

    actions.deleteRoleUser(roleUser);
  }

  render() {
    const { users, role, roleUsers } = this.props;

    const { name } = role;

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">Assign Users to {name} Role</Card.Header>
          <Card.Body>
            <Container>
              <Row>
                {users &&
                  users.map((user, index) => {
                    return (
                      <Col md={3} className="mb-3" key={`role_${index}`}>
                        <Button
                          variant={
                            roleUsers?.[user._key]
                              ? 'outline-success'
                              : 'outline-dark'
                          }
                          onClick={
                            roleUsers?.[user._key]
                              ? () =>
                                  this.removeRoleUser({
                                    role: role._key,
                                    user: user._key,
                                  })
                              : () =>
                                  this.addRoleUser({
                                    role: role._key,
                                    user: user._key,
                                  })
                          }
                          title={user.username}
                        >
                          <FontAwesomeIcon
                            icon={
                              roleUsers?.[user._key]
                                ? ['far', 'check-square']
                                : ['far', 'square']
                            }
                            size="lg"
                            className="mr-2"
                          />
                          {user.username}
                        </Button>
                      </Col>
                    );
                  })}
              </Row>
            </Container>
          </Card.Body>
          <Card.Footer>
            <ButtonGroup>
              <Button variant="light" onClick={() => this.hideEditor()}>
                <FontAwesomeIcon icon={['fas', 'key']} size="lg" />
                &nbsp;<span>Close</span>
              </Button>
            </ButtonGroup>
          </Card.Footer>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  roleUsers: getRoleUsers(state),
  user: getCurrentUser(state),
  users: getUsers(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...roleActions,
      ...userActions,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleUsersEditor);
