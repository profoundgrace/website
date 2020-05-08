import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import request from 'utils/request';
import { actions, types } from 'redux/reducers/publication';
import { actions as pubsActions } from 'redux/reducers/publications';

function* createPubWorker({ pubType: { description, name, options, title } }) {
  try {
    yield put(actions.requestPubLoading(true));

    const data = {
      description,
      name,
      options: options || {},
      title
    };

    const endpoint = {
      url: `/publications/pub`,
      method: 'POST'
    };
    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestPubLoading(false));
      yield put(pubsActions.requestPubs());
      yield call(helper.toast, {
        title: 'Publications',
        message: `Publication successfully created!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to create Publication!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestPubFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deletePubWorker({ pubType: { publication } }) {
  try {
    yield put(actions.requestPubLoading(true));

    const endpoint = {
      url: `/publications/pub/${publication}`,
      method: 'DELETE'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestPubLoading(false));
      yield put(pubsActions.requestPubs());
      yield call(helper.toast, {
        title: 'Publications',
        message: `Publication successfully deleted!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to delete Publication!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestPubFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestPubWorker({ pubType: { _key, name } }) {
  try {
    yield put(actions.requestPubLoading(true));

    //const options = yield select(getPubOptions);

    let endpoint = {};
    endpoint = {
      url: _key
        ? `/publications/pub/${_key}`
        : `/publications/pub/name/${name}`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestPubSuccess(data));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to fetch Publications!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestPubFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* createPubWatcher() {
  yield takeLatest(types.CREATE_PUB, createPubWorker);
}

function* deletePubWatcher() {
  yield takeLatest(types.DELETE_PUB, deletePubWorker);
}

function* requestPubWatcher() {
  yield takeLatest(types.REQUEST_PUB, requestPubWorker);
}

export const workers = {
  createPubWorker,
  deletePubWorker,
  requestPubWorker
};

export const watchers = {
  createPubWatcher,
  deletePubWatcher,
  requestPubWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
