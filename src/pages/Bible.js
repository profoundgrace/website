import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Tab, Tabs } from 'react-bootstrap';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { actions as booksActions } from 'redux/reducers/books';
import { getBooks } from 'redux/selectors/books';

export class Bible extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    match: PropTypes.object
  };

  componentDidMount() {
    const { actions } = this.props;

    actions.requestBooks();
  }

  render() {
    const {
      collection,
      match: { path }
    } = this.props;
    return (
      <Container fluid>
        <Helmet title="Bible" />
        <h1>Bible</h1>
        <Breadcrumbs active="Holy Bible" />
        <Tabs defaultActiveKey={path} id="uncontrolled-tab-example">
          <Tab eventKey="/bible" title="All Books">
            <Card.Body>
              {collection.map((book, index) => {
                return (
                  <Button
                    className="mb-2 mr-2"
                    variant="light"
                    as={Link}
                    key={`book${index}`}
                    to={'/bible/' + book.slug}
                  >
                    {book.name}
                  </Button>
                );
              })}
            </Card.Body>
          </Tab>
          <Tab eventKey="/bible/ot" title="Old Testament">
            <Card.Body>
              {collection.map((book, index) => {
                return book.bid < 40 ? (
                  <Button
                    className="mb-2 mr-2"
                    variant="light"
                    as={Link}
                    key={`book${index}`}
                    to={'/bible/' + book.slug}
                  >
                    {book.name}
                  </Button>
                ) : null;
              })}
            </Card.Body>
          </Tab>
          <Tab eventKey="/bible/nt" title="New Testament">
            <Card.Body>
              {collection.map((book, index) => {
                return book.bid > 39 ? (
                  <Button
                    className="mb-2 mr-2"
                    variant="light"
                    as={Link}
                    key={`book${index}`}
                    to={'/bible/' + book.slug}
                  >
                    {book.name}
                  </Button>
                ) : null;
              })}
            </Card.Body>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  collection: getBooks(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...booksActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Bible);
