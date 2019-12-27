import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { actions, types } from '../reducers/book';
import { getBookCache } from '../selectors/book';

function* requestBookWorker({ book }) {
  try {
    let cache = yield select(getBookCache);
    console.log(book);
    if(!cache.book[book]){
      let endpoint = {};
      endpoint = {
        url: `/pfg/book/${book}`,
        method: 'GET'
      };
      const bible = yield call(request.execute, { endpoint });

      if (bible.success) {
        const {
          response: { data }
        } = bible;

        cache[data.book] = data;
        const response = {
          cache: cache,
          request: data
        }
        yield put(actions.requestBookSuccess(response));
      } else if (bible.error) {
        throw bible.error;
      } else {
        throw new Error('Failed to fetch Bible Book!');
      }
    } else {
      const response = {
        cache,
        request: cache.book[book]
      }
      yield put(actions.requestBookSuccess(response));
    }
  } catch (error) {
    yield put(actions.requestBookFailure(error));
  }
}

function* requestChapterWorker({ book, chapter }) {
  try {
    let endpoint = {};
    endpoint = {
      url: `/pfg/bookid/${book}/${chapter}`,
      method: 'GET'
    };
    const bible = yield call(request.execute, { endpoint });

    if (bible.success) {
      const {
        response: { data }
      } = bible;

      const response = {
        cache: data,
        request: data
      }
      yield put(actions.requestChapterSuccess(response));
    } else if (bible.error) {
      throw bible.error;
    } else {
      throw new Error('Failed to fetch Bible Chapter!');
    }
  } catch (error) {
    yield put(actions.requestChapterFailure(error));
  }
}

function* requestBookWatcher() {
  yield takeLatest(types.REQUEST_BOOK, requestBookWorker);
}

function* requestChapterWatcher() {
  yield takeLatest(types.REQUEST_CHAPTER, requestChapterWorker);
}

export const workers = {
  requestBookWorker,
  requestChapterWorker
};

export const watchers = {
  requestBookWatcher,
  requestChapterWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
