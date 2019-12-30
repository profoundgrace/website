//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
//import { bindActionCreators } from 'redux';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Form, Navbar, Nav } from 'react-bootstrap';

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
      <Container>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">Profound Grace</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/bible">Bible</Nav.Link>
              <Nav.Link as={NavLink} to="/search">Search</Nav.Link>
            </Nav>
            <Form inline>
              <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </Container>
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