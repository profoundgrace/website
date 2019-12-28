import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import { actions as bookActions } from '../redux/reducers/book';
import { getBook, getChapterCache, getBookChapter } from '../redux/selectors/book';

export class Chapter extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    book: PropTypes.object,
    cache: PropTypes.array,
    collection: PropTypes.array,
    match: PropTypes.object
  };
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
  render() {
    const { book, collection, match: { params } } = this.props;
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
          <h2>{book.name} {params.chapter}</h2>
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
  cache: getChapterCache(state),
  collection: getBookChapter(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...bookActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chapter);
