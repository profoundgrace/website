//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
//import { bindActionCreators } from 'redux';
//import { Link, NavLink } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class Footer extends Component {
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
      <Container className="pt-3 pb-2 text-center">
        &copy; 2018-2020 ProfoundGrace.org | Powered by <FontAwesomeIcon color="red" icon={['far','heart']} /> &amp; <a href="https://github.com/profoundgrace">Open Source</a>
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
)(Footer);