import jwt from 'jsonwebtoken';
import config from '../config';

export const errorWrap = (handler) => (...args) => {
  handler(...args).catch(args[args.length - 1]);
};

/**
 * Check your statement and throw an error if falsy
 *
 * @param {Boolean} statement
 * @param {function} errorType
 * @param {String|Object} errorArgs
 */
export const assert = (statement, errorType, ...errorArgs) => {
  if (!statement) {
    throw errorType(...errorArgs);
  }
};

export const setToken = (session, payload) => {
  // eslint-disable-next-line no-param-reassign
  session[`${config.session.cookie.prefix}:access_token`] = jwt.sign(
    payload,
    config.app.secret,
    { expiresIn: '1h' },
  );
};
