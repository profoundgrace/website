import { all, call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { actions, types } from '../reducers/books';
//import { getBooks } from '../selectors/books';

function* requestBooksWorker() {
  try {
    //const books = yield select(getBooks);
    
      let endpoint = {};
      endpoint = {
        url: '/pfg/books',
        method: 'GET'
      };
      const bible = yield call(request.execute, { endpoint });

      if (bible.success) {
        const {
          response: { data }
        } = bible;

        yield put(actions.requestBooksSuccess(data));
      } else if (bible.error) {
        throw bible.error;
      } else {
        throw new Error('Failed to fetch Bible Books!');
      }
   
  } catch (error) {
    yield put(actions.requestBooksFailure(error));
  }
}

function* requestBooksWatcher() {
  yield takeLatest(types.REQUEST_BOOKS, requestBooksWorker);
}

export const workers = {
  requestBooksWorker
};

export const watchers = {
  requestBooksWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
