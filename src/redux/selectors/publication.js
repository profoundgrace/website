import { createSelector } from 'reselect';

export const getPublication = (state) => state.publication;

export const getPubInfo = createSelector(
  getPublication,
  (publication) => publication.info
);

export const getPubLoading = createSelector(
  getPublication,
  (publication) => publication.loading
);

export const getPubType = createSelector(
  getPublication,
  (publication) => publication.collection
);
