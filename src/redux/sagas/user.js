import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import request from 'utils/request';
import { actions, types } from 'redux/reducers/user';

// snake_cased variables here come from RFC 6749
function* requestUsersWorker() {
  try {
    const endpoint = {
      url: '/auth/users',
      method: 'GET',
    };
    const result = yield call(request.execute, { endpoint });

    // update user in state or throw an error
    if (result.success) {
      const {
        response: { data },
      } = result;

      yield put(actions.requestSuccess({ reqType: 'collection', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get users!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestUserWorker({ user: { _key } }) {
  try {
    const endpoint = {
      url: `/auth/user/${_key}`,
      method: 'GET',
    };
    const result = yield call(request.execute, { endpoint });

    // update user in state or throw an error
    if (result.success) {
      const {
        response: { data },
      } = result;

      yield put(actions.requestSuccess({ reqType: 'user', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get user!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* addUserWorker({ user: { _key, name, description, update } }) {
  try {
    const endpoint = {
      url: !_key ? `/auth/user` : `/auth/user/${_key}`,
      method: !_key ? 'POST' : 'PUT',
    };

    const data = {
      name,
      description,
    };

    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestUsers());
      yield call(helper.toast, {
        title: !update ? 'User Created' : `User Updated`,
        message: !update
          ? `${name} successfully added!`
          : `${name}  successfully updated!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to add User!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteUserWorker({ _key }) {
  try {
    const endpoint = {
      url: `/auth/user/${_key}`,
      method: 'DELETE',
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestUsers());
      yield call(helper.toast, {
        title: `User Deleted`,
        message: `User ID ${_key} successfully deleted!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to delete User!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestUsersWatcher() {
  yield takeLatest(types.REQUEST_USERS, requestUsersWorker);
}

/*function* requestUserWatcher() {
  yield takeLatest(types.REQUEST_USER, requestUserWorker);
}

function* addUserWatcher() {
  yield takeLatest(types.ADD_USER, addUserWorker);
}

function* deleteUserWatcher() {
  yield takeLatest(types.DELETE_USER, deleteUserWorker);
}*/

export const workers = {
  requestUsersWorker,
  requestUserWorker,
  addUserWorker,
  deleteUserWorker,
};

export const watchers = {
  requestUsersWatcher,
  //requestUserWatcher,
  //addUserWatcher,
  //deleteUserWatcher,
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
