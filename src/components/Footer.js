import React, { Component } from 'react';
import { Col, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Footer extends Component {
  render() {
    return (
      <Container fluid>
        <Col className="border-top border-light mt-3 pt-2 pb-2 text-right">
          <p>
            &copy; 2018-2020 ProfoundGrace.org | Powered by{' '}
            <FontAwesomeIcon color="red" icon={['far', 'heart']} /> &amp;{' '}
            <a href="https://github.com/profoundgrace">Open Source</a>
          </p>
        </Col>
      </Container>
    );
  }
}
