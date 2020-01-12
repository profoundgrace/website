import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as bookActions } from '../redux/reducers/book';
import { getBook } from '../redux/selectors/book';
import { getNavigation } from '../redux/selectors/navigator';

export class Book extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.object,
    match: PropTypes.object,
    navigation: PropTypes.object
  };
  constructor(props){
    super(props);

    this.updateBook = this.updateBook.bind(this);
  }
  componentDidMount() {
    const { actions, match: { params } } = this.props;
    
    actions.requestBook(params.book);
  }
  updateBook(book){
    const { actions } = this.props;

    actions.requestBook(book);
  }
  render() {
    const { collection, navigation } = this.props;
    let chapters = [];
    for (var i = 1; i <= collection.chapters; i++) {
      chapters[i] = i;
    }

    return (
      <Fragment>
        <Container>
          <Helmet title={`${collection.name} | Holy Bible`} />
          <h1>Bible</h1>
          <Breadcrumbs
            base={(collection.bid < 40) ? "ot" : "nt"}
            active={collection.name}
          />
          <h2>{collection.name}</h2>
          {navigation.previous && navigation.previous.book !== false &&
          <Button variant="primary" size="sm" onClick={(e) => this.updateBook(navigation.previous.book.slug)} as={Link} to={'/bible/'+navigation.previous.book.slug} className="mr-2 mt-2">     
            <FontAwesomeIcon icon="chevron-left" /> {navigation.previous.book.name}
          </Button>
          }
          {chapters.map((chapter,index) => {
            return(
              <Button variant="light" size="lg" as={Link} to={'/bible/'+collection.slug+'/'+chapter} className="mr-2 mt-2" key={`chapter_${chapter}`}>{chapter}</Button>
            )
          })}
          {navigation.next && navigation.next.book !== false &&
          <Button variant="primary" size="sm" onClick={(e) => this.updateBook(navigation.next.book.slug)} as={Link} to={'/bible/'+navigation.next.book.slug} className="mr-2 mt-2">     
            {navigation.next.book.name} <FontAwesomeIcon icon="chevron-right" />
          </Button>
          }
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  collection: getBook(state),
  navigation: getNavigation(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...bookActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);
