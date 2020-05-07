import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import request from 'utils/request';
import { actions, types } from 'redux/reducers/role';

// snake_cased variables here come from RFC 6749
function* requestRolesWorker() {
  try {
    const endpoint = {
      url: '/permissions/roles',
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
      throw new Error('Failed to get roles!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* addRoleWorker({ role: { _key, name, description, update } }) {
  try {
    const endpoint = {
      url: !_key ? `/permissions/role` : `/permissions/role/${_key}`,
      method: !_key ? 'POST' : 'PUT',
    };

    const data = {
      name,
      description,
    };

    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestRoles());
      yield call(helper.toast, {
        title: !update ? 'Role Created' : `Role Updated`,
        message: !update
          ? `${name} successfully added!`
          : `${name}  successfully updated!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to add Role!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteRoleWorker({ _key }) {
  try {
    const endpoint = {
      url: `/permissions/role/${_key}`,
      method: 'DELETE',
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestRoles());
      yield call(helper.toast, {
        title: `Role Deleted`,
        message: `Role ID ${_key} successfully deleted!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to delete Role!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

// snake_cased variables here come from RFC 6749
function* requestRolePrivilegesWorker({ role }) {
  try {
    const endpoint = {
      url: `/permissions/role/${role}/privileges`,
      method: 'GET',
    };
    const result = yield call(request.execute, { endpoint });

    // update user in state or throw an error
    if (result.success) {
      let {
        response: { data },
      } = result;

      let privileges = {};

      if (data?.[0]?.privileges.length > 0) {
        data[0].privileges.map((rolePrivilege, index) => {
          if (rolePrivilege) {
            return (privileges[rolePrivilege.name] = rolePrivilege);
          } else {
            return null;
          }
        });
      }

      yield put(
        actions.requestSuccess({ reqType: 'rolePrivileges', data: privileges })
      );
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
function* requestRoleUsersWorker({ role }) {
  try {
    const endpoint = {
      url: `/permissions/role/${role}/users`,
      method: 'GET',
    };
    const result = yield call(request.execute, { endpoint });

    // update user in state or throw an error
    if (result.success) {
      const {
        response: { data },
      } = result;

      let users = {};

      if (data?.[0]?.users?.length > 0) {
        data[0].users.map((roleUser, index) => {
          if (roleUser) {
            return (users[roleUser._key] = roleUser);
          } else {
            return null;
          }
        });
      }
      yield put(actions.requestSuccess({ reqType: 'roleUsers', data: users }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get role users!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* addRolePrivilegeWorker({ rolePrivilege: { role, privilege } }) {
  try {
    const endpoint = {
      url: `/permissions/role/${role}/privilege/${privilege}`,

      method: 'POST',
    };

    const data = {};

    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestRolePrivileges({ role }));
      yield call(helper.toast, {
        title: 'Role Privilege Created',
        message: `Role Privilege successfully added!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to add Role Privilege!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* addRoleUserWorker({ roleUser: { role, user } }) {
  try {
    const endpoint = {
      url: `/permissions/role/${role}/user/${user}`,

      method: 'POST',
    };

    const data = {};

    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestRoleUsers({ role }));
      yield call(helper.toast, {
        title: 'Role User Created',
        message: `Role User successfully added!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to add Role User!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteRolePrivilegeWorker({ rolePrivilege: { role, privilege } }) {
  try {
    const endpoint = {
      url: `/permissions/role/${role}/privilege/${privilege}`,
      method: 'DELETE',
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestRolePrivileges({ role }));
      yield call(helper.toast, {
        title: `Role Privilege Deleted`,
        message: `Role Privilege successfully deleted!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to delete Role Privilege!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteRoleUserWorker({ roleUser: { role, user } }) {
  try {
    const endpoint = {
      url: `/permissions/role/${role}/user/${user}`,
      method: 'DELETE',
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestRoleUsers({ role }));
      yield call(helper.toast, {
        title: `Role User Deleted`,
        message: `Role User successfully deleted!`,
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to delete Role User!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestRolesWatcher() {
  yield takeLatest(types.REQUEST_ROLES, requestRolesWorker);
}

function* addRoleWatcher() {
  yield takeLatest(types.ADD_ROLE, addRoleWorker);
}

function* deleteRoleWatcher() {
  yield takeLatest(types.DELETE_ROLE, deleteRoleWorker);
}

function* requestRolePrivilegesWatcher() {
  yield takeLatest(types.REQUEST_ROLE_PRIVILEGES, requestRolePrivilegesWorker);
}

function* requestRoleUsersWatcher() {
  yield takeLatest(types.REQUEST_ROLE_USERS, requestRoleUsersWorker);
}

function* addRolePrivilegeWatcher() {
  yield takeLatest(types.ADD_ROLE_PRIVILEGE, addRolePrivilegeWorker);
}

function* deleteRolePrivilegeWatcher() {
  yield takeLatest(types.DELETE_ROLE_PRIVILEGE, deleteRolePrivilegeWorker);
}

function* addRoleUserWatcher() {
  yield takeLatest(types.ADD_ROLE_USER, addRoleUserWorker);
}

function* deleteRoleUserWatcher() {
  yield takeLatest(types.DELETE_ROLE_USER, deleteRoleUserWorker);
}

export const workers = {
  requestRolesWorker,
  addRoleWorker,
  deleteRoleWorker,
  requestRolePrivilegesWorker,
  requestRoleUsersWorker,
  addRolePrivilegeWorker,
  deleteRolePrivilegeWorker,
  addRoleUserWorker,
  deleteRoleUserWorker,
};

export const watchers = {
  requestRolesWatcher,
  addRoleWatcher,
  deleteRoleWatcher,
  requestRolePrivilegesWatcher,
  requestRoleUsersWatcher,
  addRolePrivilegeWatcher,
  deleteRolePrivilegeWatcher,
  addRoleUserWatcher,
  deleteRoleUserWatcher,
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
