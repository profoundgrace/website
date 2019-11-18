import { createSelector } from 'reselect';

export const getBook = state => state.book;

export const getBookChapter = createSelector(
  getBook,
  book => book.collection
);

export const getBookCache = createSelector(
  getBook,
  book => book.cache
);
