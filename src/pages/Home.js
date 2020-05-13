import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import LatestArticles from 'components/Articles/Latest';

class Home extends Component {
  render() {
    return (
      <Container fluid>
        <Helmet title="Home" />
        <Jumbotron className="mb-3">
          <h1>Welcome to the New Profoundgrace.org!</h1>
          <p>
            We are rebuilding! After a couple of years of neglect, PFG is
            finally getting some much needed attention.
          </p>
          <p>
            <Button
              as={Link}
              to="/blog/welcome-to-profoundgrace"
              variant="primary"
            >
              Learn more
            </Button>
          </p>
        </Jumbotron>
        <Row>
          <Col>
            <LatestArticles />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
