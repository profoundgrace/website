import { all, put, select, take, takeLatest } from 'redux-saga/effects';
import { actions, types } from 'redux/reducers/navigator';
import {
  actions as booksActions,
  types as booksTypes
} from 'redux/reducers/books';
import { getBooks } from 'redux/selectors/books';

function* requestBookNavigatorWorker({ book }) {
  try {
    let books = yield select(getBooks);

    if (books.length === 0) {
      yield put(booksActions.requestBooks());
      yield take([
        booksTypes.REQUEST_BOOKS_SUCCESS,
        booksTypes.REQUEST_BOOKS_FAILURE
      ]);
      books = yield select(getBooks);
    }
    book = books[book - 1];

    let nextBook = false;
    let prevBook = false;

    if (book.bid < 66) {
      nextBook = books[book.bid];
    }
    if (book.bid > 1) {
      prevBook = books[book.bid - 2];
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

function* requestChapterNavigatorWorker({ book, chapter }) {
  try {
    let books = yield select(getBooks);

    if (books.length === 0) {
      yield put(booksActions.requestBooks());
      yield take([
        booksTypes.REQUEST_BOOKS_SUCCESS,
        booksTypes.REQUEST_BOOKS_FAILURE
      ]);
      books = yield select(getBooks);
    }
    book = books[Number(book) - 1];

    let nextBook = false;
    let nextChapter = false;
    let prevBook = false;
    let prevChapter = false;

    if (book.bid < 66) {
      nextBook = books[book.bid];
    }
    if (book.bid > 1) {
      prevBook = books[book.bid - 2];
    }
    if (book.chapters > chapter) {
      nextChapter = Number(chapter) + 1;
    }
    if (book.chapters > 1 && chapter > 1) {
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
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
