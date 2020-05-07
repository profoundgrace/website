import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import request from 'utils/request';
import { actions, types } from 'redux/reducers/privilege';

// snake_cased variables here come from RFC 6749
function* requestPrivilegesWorker() {
  try {
    const endpoint = {
      url: '/permissions/privileges',
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
      throw new Error('Failed to get privileges!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* addPrivilegeWorker({
  privilege: { _key, name, description, update },
}) {
  try {
    const endpoint = {
      url: !_key ? `/permissions/privilege` : `/permissions/privilege/${_key}`,
      method: !_key ? 'POST' : 'PUT',
    };

    const data = {
      name,
      description,
    };

    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestPrivileges());
      yield call(helper.toast, {
        title: !update ? 'Privilege Created' : `Privilege Updated`,
        message: !update
          ? `${name} successfully added!`
          : `${name}  successfully updated!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to add Privilege!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deletePrivilegeWorker({ privilege: { _key } }) {
  try {
    const endpoint = {
      url: `/permissions/privilege/${_key}`,
      method: 'DELETE',
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestPrivileges());
      yield call(helper.toast, {
        title: `Privilege Deleted`,
        message: `Privilege ID ${_key} successfully deleted!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to delete Privilege!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

// snake_cased variables here come from RFC 6749
function* requestPrivilegeRolesWorker({ privilege }) {
  try {
    const endpoint = {
      url: `/permissions/privilege/${privilege}/roles`,
      method: 'GET',
    };
    const result = yield call(request.execute, { endpoint });

    // update user in state or throw an error
    if (result.success) {
      const {
        response: { data },
      } = result;

      yield put(actions.requestSuccess({ reqType: 'privilegeRoles', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get role privileges!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

// snake_cased variables here come from RFC 6749
function* requestPrivilegeUsersWorker({ privilege }) {
  try {
    const endpoint = {
      url: `/permissions/privilege/${privilege}/users`,
      method: 'GET',
    };
    const result = yield call(request.execute, { endpoint });

    // update user in state or throw an error
    if (result.success) {
      const {
        response: { data },
      } = result;

      yield put(actions.requestSuccess({ reqType: 'privilegeUsers', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get privilege users!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestPrivilegesWatcher() {
  yield takeLatest(types.REQUEST_PRIVILEGES, requestPrivilegesWorker);
}

function* addPrivilegeWatcher() {
  yield takeLatest(types.ADD_PRIVILEGE, addPrivilegeWorker);
}

function* deletePrivilegeWatcher() {
  yield takeLatest(types.DELETE_PRIVILEGE, deletePrivilegeWorker);
}

function* requestPrivilegeRolesWatcher() {
  yield takeLatest(types.REQUEST_PRIVILEGE_ROLES, requestPrivilegeRolesWorker);
}

function* requestPrivilegeUsersWatcher() {
  yield takeLatest(types.REQUEST_PRIVILEGE_USERS, requestPrivilegeUsersWorker);
}

export const workers = {
  requestPrivilegesWorker,
  addPrivilegeWorker,
  deletePrivilegeWorker,
  requestPrivilegeRolesWorker,
  requestPrivilegeUsersWorker,
};

export const watchers = {
  requestPrivilegesWatcher,
  addPrivilegeWatcher,
  deletePrivilegeWatcher,
  requestPrivilegeRolesWatcher,
  requestPrivilegeUsersWatcher,
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
