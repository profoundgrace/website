import { buildActions } from 'utils';

export const types = buildActions('user', [
  'REQUEST_USERS',
  'REQUEST_USERS',
  'REQUEST_USER_PRIVILEGES',
  'ADD_USER',
  'DELETE_USER',
  'REQUEST_SUCCESS',
  'REQUEST_FAILURE',
  'RESET',
  'UI_USERS',
]);

const requestUsers = () => ({
  type: types.REQUEST_USERS,
});

const requestUser = ({ user }) => ({
  type: types.REQUEST_USER,
});

const requestUserPrivileges = ({ user }) => ({
  type: types.REQUEST_USER_PRIVILEGES,
  user,
});

const addUser = (user) => ({
  type: types.ADD_USER,
  user,
});

const deleteUser = (user) => ({
  type: types.DELETE_USER,
  user,
});

const requestSuccess = ({ reqType, data }) => ({
  type: types.REQUEST_SUCCESS,
  reqType,
  data,
});

const requestFailure = (error) => ({
  type: types.REQUEST_FAILURE,
  error,
});

const reset = (reqType) => ({
  type: types.RESET,
  reqType,
});

const uiUsers = (ui) => ({
  type: types.UI_USERS,
  ui,
});

export const actions = {
  requestUsers,
  requestUser,
  requestUserPrivileges,
  addUser,
  deleteUser,
  requestSuccess,
  requestFailure,
  reset,
  uiUsers,
};

export const initialState = {
  error: {},
  collection: [],
  loaded: false,
  loading: false,
  userPrivileges: [],
  uiUsers: {},
  user: {},
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_SUCCESS:
      return {
        ...state,
        [action.reqType]: action.data,
      };
    case types.REQUEST_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case types.RESET:
      return {
        ...state,
        [action.reqType]: {},
      };
    case types.UI_USERS:
      return {
        ...state,
        uiUsers: {
          ...state.uiUsers,
          [action.ui]: !state.uiUsers[action.ui],
        },
      };
    default:
      return state;
  }
};
