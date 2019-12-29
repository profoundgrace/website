import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as bookActions } from '../redux/reducers/book';
import { getBook, getChapter, getBookChapter } from '../redux/selectors/book';
import { getNavigation } from '../redux/selectors/navigator';

export class Chapter extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    book: PropTypes.object,
    chapter: PropTypes.number,
    collection: PropTypes.array,
    match: PropTypes.object,
    navigation: PropTypes.object
  };
  constructor(props){
    super(props);

    this.updateChapter = this.updateChapter.bind(this);
  }
  componentDidMount() {
    const { actions, match: { params } } = this.props;
    const Book = this.props.book;
    const { book, chapter } = params;

    actions.requestBook(book);
    // Page access directly (book data isn't populated)
    if(!Book.bid){
      actions.requestChapter({ book, chapter });
    // Page accessed by navigation (book data is populated)
    } else {
      actions.requestChapter({ book: Book.bid, chapter });
    }
  }
  componentDidUpdate(){
    
  }
  updateChapter(chapter){
    const { actions } = this.props;
    const Book = this.props.book;
    
    actions.requestChapter({ book: Book.bid, chapter });
  }
  render() {
    const { book, chapter, collection, navigation } = this.props;
    let formatting = [];
    let para = new RegExp("&para;");
 
      collection.forEach(function(ch, index){
        if(Array.isArray(ch.coding.match(para))){
          formatting[index + 1] = true;
        }
      });
    return (
      <Fragment>
        <Container>
          <Helmet title="Bible" />

          <h1>Bible</h1>
          <h2>{book.name} {chapter}</h2>
          {/*JSON.stringify(navigation)*/}
          {navigation.previous && navigation.previous.book &&
          <Button variant="light" size="lg" as={Link} to={'/bible/'+navigation.previous.book.slug} className="mr-2 mt-2">     
            <FontAwesomeIcon icon="chevron-left" /> {navigation.previous.book.name}
          </Button>
          }
          {navigation.previous && navigation.previous.chapter &&
          <Button variant="light" onClick={(e) => this.updateChapter(navigation.previous.chapter)} size="lg" as={Link} to={'/bible/'+book.slug+'/'+navigation.previous.chapter} className="mr-2 mt-2">
            <FontAwesomeIcon icon="chevron-left" /> {book.name} {navigation.previous.chapter}
          </Button>
          }
          <Button variant="light" size="lg" as={Link} to={'/bible/'+book.slug} className="mr-2 mt-2">     
            Chapters
          </Button>
          {navigation.next && navigation.next.chapter &&
          <Button variant="light" onClick={(e) => this.updateChapter(navigation.next.chapter)} size="lg" as={Link} to={'/bible/'+book.slug+'/'+navigation.next.chapter} className="mr-2 mt-2">     
            {book.name} {navigation.next.chapter} <FontAwesomeIcon icon="chevron-right" />
          </Button>
          }
          {navigation.next && navigation.next.book &&
          <Button variant="light" size="lg" as={Link} to={'/bible/'+navigation.next.book.slug} className="mr-2 mt-2">     
            {navigation.next.book.name} <FontAwesomeIcon icon="chevron-right" />
          </Button>
          }
          {collection.map((verse, index) => {
            
            return(
              <Fragment key={verse.verse}>
                {formatting[verse.verse] ? <br className="mb-2" /> : ''}
                <sup>&nbsp; {verse.verse}</sup> {verse.text}
              </Fragment>
            )
          })}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  book: getBook(state),
  chapter: getChapter(state),
  collection: getBookChapter(state),
  navigation: getNavigation(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...bookActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chapter);
