import { buildActions } from 'utils';
/**
 * Based on code by:
 * @author ayan4m1 <https://github.com/ayan4m1>
 * As of 20200225
 * Modified by:
 * @author daviddyess <https://github.com/daviddyess>
 */
export const types = buildActions('auth', [
  'INIT_APP',
  'LOGIN_USER',
  'REQUEST_TOKEN',
  'REQUEST_TOKEN_SUCCESS',
  'REQUEST_TOKEN_FAILURE',
  'REQUEST_CURRENT_USER',
  'REQUEST_CURRENT_USER_SUCCESS',
  'REQUEST_CURRENT_USER_FAILURE',
  'LOGIN_USER_SUCCESS',
  'LOGIN_USER_FAILURE',
  'LOGOUT_USER',
  'LOGOUT_USER_SUCCESS',
  'LOGOUT_USER_FAILURE',
  'REGISTER_USER',
  'REGISTER_USER_SUCCESS',
  'REGISTER_USER_FAILURE'
]);

const initApp = () => ({
  type: types.INIT_APP
});

const loginUser = (username, password) => ({
  type: types.LOGIN_USER,
  username,
  password
});

const requestToken = (username, password) => ({
  type: types.REQUEST_TOKEN,
  username,
  password
});

const requestTokenSuccess = ({ user, token, expiration }) => ({
  type: types.REQUEST_TOKEN_SUCCESS,
  expiration,
  token,
  user
});

const requestTokenFailure = error => ({
  type: types.REQUEST_TOKEN_FAILURE,
  error
});

const requestCurrentUser = () => ({
  type: types.REQUEST_CURRENT_USER
});

const requestCurrentUserSuccess = user => ({
  type: types.REQUEST_CURRENT_USER_SUCCESS,
  user
});

const requestCurrentUserFailure = error => ({
  type: types.REQUEST_CURRENT_USER_FAILURE,
  error
});

const loginUserSuccess = () => ({
  type: types.LOGIN_USER_SUCCESS
});

const loginUserFailure = error => ({
  type: types.LOGIN_USER_FAILURE,
  error
});

const logoutUser = () => ({
  type: types.LOGOUT_USER
});

const logoutUserSuccess = () => ({
  type: types.LOGOUT_USER_SUCCESS
});

const logoutUserFailure = error => ({
  type: types.LOGOUT_USER_FAILURE,
  error
});

const registerUser = details => ({
  type: types.REGISTER_USER,
  details
});

const registerUserSuccess = () => ({
  type: types.REGISTER_USER_SUCCESS
});

const registerUserFailure = error => ({
  type: types.REGISTER_USER_FAILURE,
  error
});

export const actions = {
  initApp,
  loginUser,
  requestToken,
  requestTokenSuccess,
  requestTokenFailure,
  requestCurrentUser,
  requestCurrentUserSuccess,
  requestCurrentUserFailure,
  loginUserSuccess,
  loginUserFailure,
  logoutUser,
  logoutUserSuccess,
  logoutUserFailure,
  registerUser,
  registerUserSuccess,
  registerUserFailure
};

export const initialState = {
  loggingIn: false,
  loggingOut: false,
  user: null,
  error: null,
  authorization: {
    accessToken: null,
    refreshToken: null,
    expiration: null
  },
  registration: {
    registering: false,
    complete: false,
    error: null
  }
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.LOGIN_USER:
      return {
        ...state,
        loggingIn: true
      };
    case types.LOGOUT_USER:
      return {
        ...state,
        loggingOut: true
      };
    case types.REGISTER_USER:
      return {
        ...state,
        registration: {
          ...state.registration,
          registering: true,
          details: action.details
        }
      };
    case types.REQUEST_TOKEN_SUCCESS:
      return {
        ...state,
        user: action.user,
        authorization: {
          ...state.authorization,
          accessToken: action.token,
          expiration: action.expiration
        }
      };
    case types.REQUEST_TOKEN_FAILURE:
      return {
        ...state,
        authorization: {
          ...state.authorization,
          error: action.error
        }
      };
    case types.REQUEST_CURRENT_USER_SUCCESS:
      return {
        ...state,
        user: action.user
      };
    case types.LOGOUT_USER_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null,
        authorization: initialState.authorization
      };
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        loggingIn: false
      };
    case types.LOGIN_USER_FAILURE:
    case types.LOGOUT_USER_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loggingOut: false,
        error: action.error
      };
    case types.REGISTER_USER_SUCCESS:
      return {
        ...state,
        registration: {
          registering: false,
          complete: true,
          error: null
        }
      };
    case types.REGISTER_USER_FAILURE:
      return {
        ...state,
        registration: {
          registering: false,
          complete: true,
          error: action.error
        }
      };
    default:
      return state;
  }
};
