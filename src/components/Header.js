import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Link, NavLink } from 'react-router-dom';
import { Container, Dropdown, Form, Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { actions as authActions } from 'redux/reducers/auth';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';

export class Header extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    const { actions } = this.props;
    this.logoutUser = this.logoutUser.bind(this);
    actions.requestCurrentUser();
  }

  logoutUser() {
    const { actions } = this.props;

    actions.logoutUser();
  }

  get userIcon() {
    return <FontAwesomeIcon icon="user-circle" />;
  }

  render() {
    const { loggedIn, user } = this.props;

    return (
      <Container fluid>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand as={Link} to="/">
            Profound Grace
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/bible">
                Bible
              </Nav.Link>
              <Nav.Link as={NavLink} to="/search">
                Search
              </Nav.Link>
              {!loggedIn && (
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
            <Form inline action="/search" method="get">
              <Form.Control
                type="text"
                placeholder="Bible Search"
                className="mr-sm-2"
                name="q"
              />
            </Form>
            <Nav>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="admin-dropdown">
                  Administrator
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/admin/roles">
                    Roles
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/admin/privileges">
                    Privileges
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/admin/users">
                    Users
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={NavLink} to="/admin/publications">
                    Publications
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {loggedIn && user ? (
                <Dropdown alignRight>
                  <Dropdown.Toggle variant="success" id="user-dropdown">
                    {this.userIcon} {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Account</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/login" onClick={this.logoutUser}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Fragment>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                </Fragment>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
