import { combineReducers } from 'redux';

import {
  reducer as book,
  initialState as bookState
} from './book';

export const initialState = {
  book: bookState
};

export default combineReducers({
  book
});
