import { createSelector } from 'reselect';

export const getKJVSearch = (state) => state.search;

export const getSearchInfo = createSelector(
  getKJVSearch,
  (search) => search.info
);

export const getSearchLoading = createSelector(
  getKJVSearch,
  (search) => search.loading
);

export const getSearchOptions = createSelector(
  getKJVSearch,
  (search) => search.options
);

export const getSearchQuery = createSelector(
  getKJVSearch,
  (search) => search.query
);

export const getSearchResult = createSelector(
  getKJVSearch,
  (search) => search.result
);
