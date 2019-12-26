import { all, call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { actions, types } from '../reducers/book';
//import { getBookChapter } from '../selectors/book';

function* requestChapterWorker({ bid, cid }) {
  try {
    let endpoint = {};
    endpoint = {
      url: '/pfg/book/2/1',
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

function* requestChapterWatcher() {
  yield takeLatest(types.REQUEST_CHAPTER, requestChapterWorker);
}

export const workers = {
  requestChapterWorker
};

export const watchers = {
  requestChapterWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
