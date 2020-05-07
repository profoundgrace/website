import React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Container } from 'react-bootstrap';

function NotFound() {
  return (
    <Container fluid>
      <Helmet title="Page Not Found" />
      <Col md="auto" className="p-4 pt-5">
        <h4 className="text-center text-info">404 - Error : Page Not Found</h4>
      </Col>
    </Container>
  );
}

export default NotFound;
