import { createSelector } from 'reselect';

export const getUsersSelector = (state) => state.user;

export const getUsers = createSelector(
  getUsersSelector,
  (user) => user.collection
);

export const getUser = createSelector(getUsersSelector, (user) => user.user);

export const getUserLoading = createSelector(
  getUsersSelector,
  (user) => user.loading
);

export const getUserPrivileges = createSelector(
  getUsersSelector,
  (user) => user.userPrivileges
);

export const getUIUsers = createSelector(
  getUsersSelector,
  (user) => user.uiUsers
);

export const getError = createSelector(getUsersSelector, (user) => user.error);
