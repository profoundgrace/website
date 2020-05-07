import { createSelector } from 'reselect';

export const getRolesSelector = (state) => state.role;

export const getRoles = createSelector(
  getRolesSelector,
  (role) => role.collection
);

export const getRoleUsers = createSelector(
  getRolesSelector,
  (role) => role.roleUsers
);

export const getRolePrivileges = createSelector(
  getRolesSelector,
  (role) => role.rolePrivileges
);

export const getUIRoles = createSelector(
  getRolesSelector,
  (role) => role.uiRoles
);

export const getUIRolePrivilegesList = createSelector(
  getRolesSelector,
  (role) => role.uiRoles?.rolePrivilegesList
);

export const getError = createSelector(getRolesSelector, (role) => role.error);
