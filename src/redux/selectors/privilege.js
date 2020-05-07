import { createSelector } from 'reselect';

export const getPrivilegesSelector = (state) => state.privilege;

export const getPrivileges = createSelector(
  getPrivilegesSelector,
  (privilege) => privilege.collection
);

export const getPrivilegeUsers = createSelector(
  getPrivilegesSelector,
  (privilege) => privilege.privilegeUsers
);

export const getPrivilegeRoles = createSelector(
  getPrivilegesSelector,
  (privilege) => privilege.privilegeRoles
);

export const getUIPrivileges = createSelector(
  getPrivilegesSelector,
  (privilege) => privilege.uiPrivileges
);

export const getUIPrivilegesList = createSelector(
  getPrivilegesSelector,
  (privilege) => privilege.uiPrivileges?.privilegePrivilegesList
);

export const getError = createSelector(
  getPrivilegesSelector,
  (privilege) => privilege.error
);
