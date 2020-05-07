import { buildActions } from 'utils';

export const types = buildActions('privilege', [
  'REQUEST_PRIVILEGES',
  'REQUEST_PRIVILEGE_ROLES',
  'REQUEST_PRIVILEGE_USERS',
  'ADD_PRIVILEGE',
  'DELETE_PRIVILEGE',
  'REQUEST_SUCCESS',
  'REQUEST_FAILURE',
  'RESET',
  'UI_PRIVILEGES',
]);

const requestPrivileges = () => ({
  type: types.REQUEST_PRIVILEGES,
});

const requestPrivilegeRoles = ({ privilege }) => ({
  type: types.REQUEST_PRIVILEGE_ROLES,
  privilege,
});

const requestPrivilegeUsers = ({ privilege }) => ({
  type: types.REQUEST_PRIVILEGE_USERS,
  privilege,
});

const addPrivilege = (privilege) => ({
  type: types.ADD_PRIVILEGE,
  privilege,
});

const deletePrivilege = (privilege) => ({
  type: types.DELETE_PRIVILEGE,
  privilege,
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

const uiPrivileges = (ui) => ({
  type: types.UI_PRIVILEGES,
  ui,
});

export const actions = {
  requestPrivileges,
  requestPrivilegeRoles,
  requestPrivilegeUsers,
  addPrivilege,
  deletePrivilege,
  requestSuccess,
  requestFailure,
  reset,
  uiPrivileges,
};

export const initialState = {
  error: {},
  collection: [],
  loaded: false,
  loading: false,
  privilegeRoles: [],
  privilegeUsers: {},
  uiPrivileges: {},
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
    case types.UI_PRIVILEGES:
      return {
        ...state,
        uiPrivileges: {
          ...state.uiPrivileges,
          [action.ui]: !state.uiPrivileges[action.ui],
        },
      };
    default:
      return state;
  }
};
