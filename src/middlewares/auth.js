import jwt from 'jsonwebtoken';
import { unauthorized } from '@hapi/boom';
import { models } from 'mongoose';

import { assert, errorWrap } from '../helpers';
import config from '../config';

export default function auth(schema) {
  return errorWrap(async (req, res, next) => {
    const token = req.session[`${config.session.cookie.prefix}:access_token`];

    assert(token, unauthorized, 'Invalid access token');

    jwt.verify(token, config.app.secret, async (err, user) => {
      assert(token, unauthorized, 'Invalid access token');
      const model = await models.User.findOne({ _id: user._id });
      assert(model, unauthorized, 'Invalid access token');
      req.user = model;
      next();
    });
  });
}
