import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { actions, types } from '../reducers/navigator';
import { actions as booksActions} from '../reducers/books';
import { getBooks } from '../selectors/books';

function* requestBookNavigatorWorker({book}) {
  console.log("running book navigator");
  try {
    let books = yield select(getBooks);

    if(books.length === 0){
      let endpoint = {};
      endpoint = {
        url: '/pfg/books',
        method: 'GET'
      };
      const bible = yield call(request.execute, { endpoint });

      if (bible.success) {
        const {
          response: { books }
        } = bible;
        // Save this books data
        yield put(booksActions.requestBooksSuccess(books));

      } else if (bible.error) {
        throw bible.error;
      } else {
        throw new Error('Failed to fetch books for navigation!');
      }
    }
    book = books[book-1];

    let nextBook = null;
    let prevBook = null;
    
    if(book.bid < 66){
      nextBook = books[book.bid];
    }
    if(book.bid > 1){
      prevBook = books[book.bid-2];
    }
    const nav = {
      previous: {
        book: prevBook
      },
      next: {
        book: nextBook
      }
    };
    yield put(actions.requestNavigatorSuccess(nav));
  } catch (error) {
    yield put(actions.requestNavigatorFailure(error));
  }
}

function* requestChapterNavigatorWorker({book, chapter}) {
  console.log("running chapter navigator");
  try {
    let books = yield select(getBooks);

    if(books.length === 0){
      let endpoint = {};
      endpoint = {
        url: '/pfg/books',
        method: 'GET'
      };
      const bible = yield call(request.execute, { endpoint });

      if (bible.success) {
        const {
          response: { books }
        } = bible;
        // Save this books data
        yield put(booksActions.requestBooksSuccess(books));

      } else if (bible.error) {
        throw bible.error;
      } else {
        throw new Error('Failed to fetch books for navigation!');
      }
    }
    book = books[book-1];

    let nextBook = null;
    let nextChapter = null;
    let prevBook = null;
    let prevChapter = null;
    
    if(book.bid < 66){
      nextBook = books[book.bid];
    }
    if(book.bid > 1){
      prevBook = books[book.bid-2];
    }
    if(book.chapters > chapter){
      nextChapter = Number(chapter) + 1;
    }
    if((book.chapters > 1) && (chapter > 1)){
      prevChapter = Number(chapter) - 1;
    }
    const nav = {
      previous: {
        book: prevBook,
        chapter: prevChapter
      },
      next: {
        book: nextBook,
        chapter: nextChapter
      }
    };
    yield put(actions.requestNavigatorSuccess(nav));
  } catch (error) {
    yield put(actions.requestNavigatorFailure(error));
  }
}

function* requestBookNavigatorWatcher() {
  yield takeLatest(types.REQUEST_BOOK_NAV, requestBookNavigatorWorker);
}

function* requestChapterNavigatorWatcher() {
  yield takeLatest(types.REQUEST_CHAPTER_NAV, requestChapterNavigatorWorker);
}

export const workers = {
  requestBookNavigatorWorker,
  requestChapterNavigatorWorker
};

export const watchers = {
  requestBookNavigatorWatcher,
  requestChapterNavigatorWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
