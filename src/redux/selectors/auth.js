import dayjs from 'dayjs';
import { createSelector } from 'reselect';
/**
 * Based on code by:
 * @author ayan4m1 <https://github.com/ayan4m1>
 * As of 20200225
 * Modified by:
 * @author daviddyess <https://github.com/daviddyess>
 */
export const getAuth = (state) => state.auth;

export const isLoggingIn = createSelector(getAuth, (auth) =>
  Boolean(auth.loggingIn)
);

export const isLoggingOut = createSelector(getAuth, (auth) =>
  Boolean(auth.loggingOut)
);

export const getCurrentUser = createSelector(getAuth, (auth) => auth.user);

export const getError = createSelector(getAuth, (auth) => auth.error);

export const getAuthorization = createSelector(
  getAuth,
  (auth) => auth.authorization
);

export const getToken = createSelector(
  getAuthorization,
  (authorization) => authorization.accessToken
);

export const getTokenExpiration = createSelector(
  getAuthorization,
  (authorization) => authorization.expiration
);

export const isLoggedIn = createSelector(
  [getToken, getTokenExpiration],
  (token, expiration) => Boolean(token && dayjs().isBefore(dayjs(expiration)))
);

export const getRegistration = createSelector(
  getAuth,
  (auth) => auth.registration
);

export const isRegistering = createSelector(
  getRegistration,
  (registration) => registration.registering && !registration.complete
);
