import { buildActions } from 'utils';

export const types = buildActions('role', [
  'REQUEST_ROLES',
  'REQUEST_ROLE_PRIVILEGES',
  'REQUEST_ROLE_USERS',
  'ADD_ROLE',
  'DELETE_ROLE',
  'ADD_ROLE_PRIVILEGE',
  'DELETE_ROLE_PRIVILEGE',
  'ADD_ROLE_USER',
  'DELETE_ROLE_USER',
  'REQUEST_SUCCESS',
  'REQUEST_FAILURE',
  'RESET',
  'UI_ROLES'
]);

const requestRoles = () => ({
  type: types.REQUEST_ROLES
});

const requestRolePrivileges = ({ role }) => ({
  type: types.REQUEST_ROLE_PRIVILEGES,
  role
});

const requestRoleUsers = ({ role }) => ({
  type: types.REQUEST_ROLE_USERS,
  role
});

const addRole = (role) => ({
  type: types.ADD_ROLE,
  role
});

const deleteRole = (role) => ({
  type: types.DELETE_ROLE,
  role
});

const addRolePrivilege = (rolePrivilege) => ({
  type: types.ADD_ROLE_PRIVILEGE,
  rolePrivilege
});

const deleteRolePrivilege = (rolePrivilege) => ({
  type: types.DELETE_ROLE_PRIVILEGE,
  rolePrivilege
});

const addRoleUser = (roleUser) => ({
  type: types.ADD_ROLE_USER,
  roleUser
});

const deleteRoleUser = (roleUser) => ({
  type: types.DELETE_ROLE_USER,
  roleUser
});

const requestSuccess = ({ reqType, data }) => ({
  type: types.REQUEST_SUCCESS,
  reqType,
  data
});

const requestFailure = (error) => ({
  type: types.REQUEST_FAILURE,
  error
});

const reset = (reqType) => ({
  type: types.RESET,
  reqType
});

const uiRoles = (ui) => ({
  type: types.UI_ROLES,
  ui
});

export const actions = {
  requestRoles,
  requestRolePrivileges,
  requestRoleUsers,
  addRole,
  deleteRole,
  addRolePrivilege,
  deleteRolePrivilege,
  addRoleUser,
  deleteRoleUser,
  requestSuccess,
  requestFailure,
  reset,
  uiRoles
};

export const initialState = {
  error: {},
  collection: [],
  loaded: false,
  loading: false,
  rolePrivileges: {},
  roleUsers: {},
  uiRoles: {}
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_SUCCESS:
      return {
        ...state,
        [action.reqType]: action.data
      };
    case types.REQUEST_FAILURE:
      return {
        ...state,
        error: action.error
      };
    case types.RESET:
      return {
        ...state,
        [action.reqType]: {}
      };
    case types.UI_ROLES:
      return {
        ...state,
        uiRoles: {
          ...state.uiRoles,
          [action.ui]: !state.uiRoles[action.ui]
        }
      };
    default:
      return state;
  }
};
