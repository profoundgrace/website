import dayjs from 'dayjs';
import { all, call, put, takeLatest, take, select } from 'redux-saga/effects';

import request from '../../utils/request';
import { actions, types } from '../reducers/auth';
import { actions as toastActions } from '../reducers/toast';
import { isLoggedIn/*, getUser*/ } from '../selectors/auth';
/**
 * Based on code by:
 * @author ayan4m1 <https://github.com/ayan4m1>
 * As of 20200225
 * Modified by:
 * @author daviddyess <https://github.com/daviddyess>
 */
// snake_cased variables here come from RFC 6749
/* eslint-disable camelcase */
function* requestTokenWorker({ username, password }) {
  try {
    const endpoint = {
      url: '/auth/login',
      method: 'POST'
    };
    const data = {
      username,
      password
    };
    const result = yield call(request.execute, { endpoint, data });

    // update token info in state or throw an error
    if (result.success) {
      const {
        data: {
          sid: { _key: token, created, uid },
          username
        }
      } = result.response;

      const user = {
        id: uid,
        name: username
      };

      const expiration = created + 604700000; // 1 week (ms)
      
      yield put(actions.requestTokenSuccess({ user, token, expiration }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Request failed for an unspecified reason!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestTokenFailure(error));
    yield put(
      toastActions.popToast({
        title: 'Error!',
        icon: 'times-circle',
        message
      })
    );
  }
}
/* eslint-enable camelcase */

function* requestCurrentUserWorker() {
  try {
    const endpoint = {
      url: '/auth/me',
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    // update user in state or throw an error
    if (result.success) {
      const {
        response: { data }
      } = result;
      const user = {
        name: data.username,
        id: data.userid,
        data: data.data
      }
      yield put(actions.requestCurrentUserSuccess(user));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get current user!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestCurrentUserFailure(error));
    yield put(
      toastActions.popToast({
        title: 'Error',
        icon: 'times-circle',
        message
      })
    );
  }
}

function* loginUserWorker({ username, password }) {
  try {
    // first, check to see if we are already logged in
    const loggedIn = yield select(isLoggedIn);

    if (!loggedIn) {
      // obtain a bearer token
      // then, obtain current user information
      // use take because it is blocking
      yield put(actions.requestToken(username, password));
      const tokenResult = yield take([
        types.REQUEST_TOKEN_SUCCESS,
        types.REQUEST_TOKEN_FAILURE
      ]);

      if (tokenResult.type === types.REQUEST_TOKEN_FAILURE) {
        throw new Error('Failed to log in!');
      }

      const { token, expiration, user } = tokenResult;

      localStorage.setItem('accessToken', JSON.stringify(token));
      localStorage.setItem(
        'expiration',
        JSON.stringify(dayjs(expiration).toISOString())
      );

      yield put(
        toastActions.popToast({
          title: 'Logged in',
          icon: 'check',
          message: `${user.name}, has been authenticated.`
        })
      );
    }
    
    /*
    let user = yield select(getUser);

    if (!user) {
      yield put(actions.requestCurrentUser());
      const currentUserResult = yield take([
        types.REQUEST_CURRENT_USER_SUCCESS,
        types.REQUEST_CURRENT_USER_FAILURE
      ]);

      if (currentUserResult.type === types.REQUEST_CURRENT_USER_FAILURE) {
        throw new Error('Failed to fetch current user!');
      }

      user = currentUserResult.user;

      if (!user) {
        throw new Error('Got invalid response to current user request!');
      }
    }
    */
    yield put(actions.loginUserSuccess());
  } catch (error) {
    const { message } = error;

    yield put(actions.loginUserFailure(error));
    yield put(
      toastActions.popToast({
        title: 'Error',
        icon: 'times-circle',
        message
      })
    );
  }
}

function* logoutUserWorker() {
  try {
    // first, check to see if we are logged in
    const loggedIn = yield select(isLoggedIn);

    if (loggedIn) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('expiration');
    }

    yield put(
      toastActions.popToast({
        title: 'Logged out',
        icon: 'check',
        message: 'You have been logged out.'
      })
    );

    yield put(actions.logoutUserSuccess());
  } catch (error) {
    const { message } = error;

    yield put(actions.logoutUserFailure(error));
    yield put(
      toastActions.popToast({
        title: 'Error',
        icon: 'times-circle',
        message
      })
    );
  }
}

function* registerUserWorker({
  details: { username, email, password }
}) {
  try {
    const endpoint = {
      url: '/auth/register',
      method: 'POST'
    };
    const data = {
      username,
      password,
      email
    };
    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.registerUserSuccess());
      yield put(
        toastActions.popToast({
          title: 'Success!',
          icon: 'check',
          message: 'You may now log in.'
        })
      );
    } else {
      throw result.error;
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.registerUserFailure(error));
    yield put(
      toastActions.popToast({
        title: 'Error',
        icon: 'times-circle',
        message
      })
    );
  }
}

function* loginUserWatcher() {
  yield takeLatest(types.LOGIN_USER, loginUserWorker);
}

function* logoutUserWatcher() {
  yield takeLatest(types.LOGOUT_USER, logoutUserWorker);
}

function* requestTokenWatcher() {
  yield takeLatest(types.REQUEST_TOKEN, requestTokenWorker);
}

function* requestCurrentUserWatcher() {
  yield takeLatest(types.REQUEST_CURRENT_USER, requestCurrentUserWorker);
}

function* registerUserWatcher() {
  yield takeLatest(types.REGISTER_USER, registerUserWorker);
}

export const workers = {
  loginUserWorker,
  logoutUserWorker,
  registerUserWorker,
  requestTokenWorker,
  requestCurrentUserWorker
};

export const watchers = {
  loginUserWatcher,
  logoutUserWatcher,
  registerUserWatcher,
  requestTokenWatcher,
  requestCurrentUserWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
