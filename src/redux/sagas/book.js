import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { actions, types } from '../reducers/book';
import { actions as navActions } from '../reducers/navigator';
import { getBookCache, getChapterCache } from '../selectors/book';

function* requestBookWorker({ book }) {
  try {
    let cache = yield select(getBookCache);

    if(!cache[book]){
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
        cache[book] = data;
        const response = {
          cache,
          request: data
        }
        // Populate Navigation
        yield put(navActions.requestBookNavigator({book:data.bid}));
        yield put(actions.requestBookSuccess(response));
      } else if (bible.error) {
        throw bible.error;
      } else {
        throw new Error('Failed to fetch Bible Book!');
      }
    } else {
      const response = {
        cache,
        request: cache[book]
      }
      // Populate Navigation
      yield put(navActions.requestBookNavigator({book:cache[book].bid}));
      // Return Cached Book Data
      yield put(actions.requestBookSuccess(response));
    }
  } catch (error) {
    yield put(actions.requestBookFailure(error));
  }
}

function* requestChapterWorker({ book, chapter }) {
  try {
    let cache = yield select(getChapterCache);
    if(!cache[book]){
      cache[book] = [];
    }
    if(!cache[book][chapter]){
      let endpoint = {};

      if(isNaN(book)){
        endpoint = {
          url: `/pfg/book/${book}/${chapter}`,
          method: 'GET'
        };
      } else {
        endpoint = {
          url: `/pfg/bookid/${book}/${chapter}`,
          method: 'GET'
        };
      }
      const bible = yield call(request.execute, { endpoint });

      if (bible.success) {
        const {
          response: { data }
        } = bible;
        if(!cache[book]){
          cache[book] = [];
        }
        cache[book][chapter] = data;
        const response = {
          cache,
          request: data,
          chapter
        }
        // Populate Navigation
        if(isNaN(book)){
          yield put(navActions.requestChapterNavigator({book:data[0].bid, chapter}));
        } else {
          yield put(navActions.requestChapterNavigator({book, chapter}));
        }
        yield put(actions.requestChapterSuccess(response));
      } else if (bible.error) {
        throw bible.error;
      } else {
        throw new Error('Failed to fetch Bible Chapter!');
      }
    } else {
      const response = {
        cache,
        request: cache[book][chapter],
        chapter
      };
      // Populate Navigation
      yield put(navActions.requestChapterNavigator({book:cache[book][chapter][0].bid, chapter}));
      // Return Cached Chapter Text Data
      yield put(actions.requestChapterSuccess(response));
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
