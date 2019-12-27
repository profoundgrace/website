import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, Container, Tab, Tabs } from 'react-bootstrap';
import { actions as booksActions } from '../redux/reducers/books';
import { getBooks } from '../redux/selectors/books';

export class Bible extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.object
  };
/*
  constructor(props){
    super(props);
  }
*/
  componentDidMount() {
    const { actions } = this.props;

    actions.requestBooks();

    
  }
  render() {
    const { collection } = this.props;
    return (
      <Fragment>
        <Container>
          <Helmet title="Bible" />
          <h1>Bible</h1>
          <Tabs defaultActiveKey="ot" id="uncontrolled-tab-example">
            <Tab eventKey="ot" title="Old Testament">
              <Card.Body>
                {collection.map((book, index) => {
                  return (
                    book.bid < 40 ?
                    <p key={index}><Link to={'/bible/'+book.slug}>{book.name}</Link></p>
                    : ''
                  );
                })}
              </Card.Body>
            </Tab>
            <Tab eventKey="nt" title="New Testament">
              <Card.Body>
                {collection.map((book, index) => {
                  return (
                    book.bid > 39 ?
                    <p key={index}><Link to={'/bible/'+book.slug}>{book.name}</Link></p>
                    : ''
                  );
                })}
              </Card.Body>
            </Tab>
          </Tabs>
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  collection: getBooks(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...booksActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bible);
