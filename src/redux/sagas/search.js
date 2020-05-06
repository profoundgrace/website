import { all, call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { actions, types } from 'redux/reducers/search';
//import { getSearchOptions } from 'redux/selectors/search';

function* requestSearchWorker({ search: { query, page } }) {
  try {
    yield put(actions.requestLoading(true));

    //const options = yield select(getSearchOptions);

    let endpoint = {};
    endpoint = {
      url: `/bible/search/?query=${query}&page=${page}`,
      method: 'GET'
    };
    const bible = yield call(request.execute, { endpoint });

    if (bible.success) {
      const {
        response: {
          data: { verses, stats }
        }
      } = bible;

      const info = {
        count: stats?.fullCount,
        executionTime: stats?.executionTime,
        pages:
          Number(stats?.fullCount) > 20
            ? Math.ceil(Number(stats?.fullCount) / 20)
            : 1,
        page
      };

      yield put(actions.requestSearchSuccess(query, verses, info));
      yield put(actions.requestLoading(false));
    } else if (bible.error) {
      throw bible.error;
    } else {
      throw new Error('Failed to fetch Bible Search!');
    }
  } catch (error) {
    yield put(actions.requestSearchFailure(error));
    yield put(actions.requestLoading(false));
  }
}

function* requestSearchWatcher() {
  yield takeLatest(types.REQUEST_SEARCH, requestSearchWorker);
}

export const workers = {
  requestSearchWorker
};

export const watchers = {
  requestSearchWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
