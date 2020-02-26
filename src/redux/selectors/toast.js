import { createSelector } from 'reselect';
/**
 * Based on code by:
 * @author ayan4m1 <https://github.com/ayan4m1>
 * As of 20200225
 * Modified by:
 * @author daviddyess <https://github.com/daviddyess>
 */
export const getToasts = state => state.toast;

export const getQueue = createSelector(getToasts, toast => toast.queue);
