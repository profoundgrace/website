import { createSelector } from 'reselect';

export const getNavigator = (state) => state.navigator;

export const getNavigation = createSelector(
  getNavigator,
  (navigator) => navigator.navigation
);
