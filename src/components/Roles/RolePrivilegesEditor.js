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
  Row
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as privilegeActions } from 'redux/reducers/privilege';
import { actions as roleActions } from 'redux/reducers/role';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getPrivileges } from 'redux/selectors/privilege';
import { getRolePrivileges } from 'redux/selectors/role';

export class RolePrivilegesEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    privileges: PropTypes.array,
    role: PropTypes.object,
    rolePrivileges: PropTypes.object,
    user: PropTypes.object
  };
  static defaultProps = {
    role: {},
    rolePrivileges: {}
  };

  constructor(props) {
    super(props);
    this.addRolePrivilege = this.addRolePrivilege.bind(this);
    this.removeRolePrivilege = this.removeRolePrivilege.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  componentDidMount() {
    const { actions, role } = this.props;

    actions.requestPrivileges();
    actions.requestRolePrivileges({ role: role._key });
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'role', status: false });
    actions.displayEditor({ editor: 'roles', status: false });
    actions.displayEditor({ editor: 'rolePrivileges', status: false });
  }

  addRolePrivilege(rolePrivilege) {
    const { actions } = this.props;

    actions.addRolePrivilege(rolePrivilege);
  }

  removeRolePrivilege(rolePrivilege) {
    const { actions } = this.props;

    actions.deleteRolePrivilege(rolePrivilege);
  }

  render() {
    const { privileges, role, rolePrivileges } = this.props;

    const { name } = role;

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">Assign Privileges to {name} Role</Card.Header>
          <Card.Body>
            <Container>
              <Row>
                {privileges &&
                  privileges.map((privilege, index) => {
                    return (
                      <Col md={3} className="mb-3" key={`priv_${index}`}>
                        <Button
                          variant={
                            rolePrivileges?.[privilege.name]
                              ? 'outline-success'
                              : 'outline-dark'
                          }
                          onClick={
                            rolePrivileges?.[privilege.name]
                              ? () =>
                                  this.removeRolePrivilege({
                                    role: role._key,
                                    privilege: privilege._key
                                  })
                              : () =>
                                  this.addRolePrivilege({
                                    role: role._key,
                                    privilege: privilege._key
                                  })
                          }
                          title={privilege.description}
                        >
                          <FontAwesomeIcon
                            icon={
                              rolePrivileges?.[privilege.name]
                                ? ['far', 'check-square']
                                : ['far', 'square']
                            }
                            size="lg"
                            className="mr-2"
                          />
                          {privilege.name}
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
  privileges: getPrivileges(state),
  rolePrivileges: getRolePrivileges(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...privilegeActions,
      ...roleActions
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RolePrivilegesEditor);
