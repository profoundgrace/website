import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Form, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { actions as authActions } from '../redux/reducers/auth';
import { getUser, isLoggedIn } from '../redux/selectors/auth';

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
    return(
        <FontAwesomeIcon icon="user-circle" />
    )
  }

  render() {
    const { loggedIn, user } = this.props;

    return (
      <Container>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">Profound Grace</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/bible">Bible</Nav.Link>
              <Nav.Link as={NavLink} to="/search">Search</Nav.Link>
              {!loggedIn &&
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              }
            </Nav>
            <Form inline>
              <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form>
            {loggedIn && user ?              
              <NavDropdown title={user.name} id="user-nav-menu">
                <NavDropdown.Item href="#action/3.3">Account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/login" onClick={this.logoutUser}>Logout</NavDropdown.Item>
              </NavDropdown>
              :
              <Fragment>
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </Fragment>
            }
          </Navbar.Collapse>
        </Navbar>
      </Container>
    );
  }

}

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  user: getUser(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);