import { createSelector } from 'reselect';

export const getPublications = (state) => state.publications;

export const getPubsInfo = createSelector(
  getPublications,
  (publications) => publications.info
);

export const getPubsLoading = createSelector(
  getPublications,
  (publications) => publications.loading
);

export const getPubTypes = createSelector(
  getPublications,
  (publications) => publications.collection
);
