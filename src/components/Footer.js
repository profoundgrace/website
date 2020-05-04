import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Footer extends Component {
  render() {
    return (
      <Container className="pt-3 pb-2 text-center">
        &copy; 2018-2020 ProfoundGrace.org | Powered by{' '}
        <FontAwesomeIcon color="red" icon={['far', 'heart']} /> &amp;{' '}
        <a href="https://github.com/profoundgrace">Open Source</a>
      </Container>
    );
  }
}
