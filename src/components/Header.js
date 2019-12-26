//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
//import { bindActionCreators } from 'redux';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export class Header extends Component {
  static propTypes = {
    //actions: PropTypes.object.isRequired,
    //loggedIn: PropTypes.bool.isRequired
  };
  /*
  constructor(props) {
    super(props);

    //this.logoutUser = this.logoutUser.bind(this);
  }
  */
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Profound Grace</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/bible">Bible</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

const mapStateToProps = state => ({
  //loggedIn: isLoggedIn(state)
});

const mapDispatchToProps = dispatch => ({
  //actions: bindActionCreators(appActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);