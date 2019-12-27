import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { actions as bookActions } from '../redux/reducers/book';
import { getBook } from '../redux/selectors/book';

export class Book extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    match: PropTypes.object
  };
  componentDidMount() {
    const { actions, match: { params } } = this.props;
    
    actions.requestBook(params.book);
  }
  render() {
    const { collection } = this.props;
    let chapters = [];
    for (var i = 1; i <= collection.chapters; i++) {
      chapters[i] = i;
    }

    return (
      <Fragment>
        <Container>
          <Helmet title="Bible" />

          <h1>Bible</h1>
          <h2>{collection.name}</h2>
          
          {chapters.map((chapter,index) => {
            return(
              <Button variant="light" size="lg" as={Link} to={'/bible/'+collection.slug+'/'+chapter} className="mr-2 mt-2">{chapter}</Button>
            )
          })}
          
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  collection: getBook(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...bookActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);
