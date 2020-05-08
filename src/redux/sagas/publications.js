import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import request from 'utils/request';
import { actions, types } from 'redux/reducers/publications';

function* requestPubsWorker() {
  try {
    yield put(actions.requestPubsLoading(true));

    let endpoint = {};
    endpoint = {
      url: `/publications/pubs`,
      method: 'GET'
    };
    const pubs = yield call(request.execute, { endpoint });

    if (pubs.success) {
      const {
        response: { data }
      } = pubs;

      yield put(actions.requestPubsSuccess(data));
      yield put(actions.requestPubsLoading(false));
    } else if (pubs.error) {
      throw pubs.error;
    } else {
      throw new Error('Failed to fetch Publications!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestPubsFailure(error));
    yield put(actions.requestPubsLoading(false));
    yield call(helper.errorToast, message);
  }
}

function* requestPubsWatcher() {
  yield takeLatest(types.REQUEST_PUBS, requestPubsWorker);
}

export const workers = {
  requestPubsWorker
};

export const watchers = {
  requestPubsWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
