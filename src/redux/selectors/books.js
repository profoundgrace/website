import { createSelector } from 'reselect';

export const getKJVBooks = state => state.books;

export const getBooks = createSelector(
  getKJVBooks,
  books => books.collection
);

export const getBooksCache = createSelector(
  getKJVBooks,
  books => books.cache
);
