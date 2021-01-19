import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import { forbidden } from '@hapi/boom';
import { models } from 'mongoose';

import { METHODS } from '../../config/constants';
import { assert, setToken } from '../../helpers';

export const login = {
  method: METHODS.POST,
  path: '/login',
  public: true,
  validate: {
    body: {
      email: Joi.string().email({ tlds: false }).required(),
      password: Joi.string().required(),
    },
  },
  async handler(req, res) {
    const { email, password } = req.body;
    const user = await models.User.findOne({ email });
    assert(user, forbidden, 'Invalid credentials');
    assert(bcrypt.compareSync(password, user.password), forbidden, 'Invalid credentials');
    setToken(req.session, { _id: user._id });
    res.json({ data: user });
  },
};

export const register = {
  method: METHODS.POST,
  path: '/register',
  public: true,
  validate: {
    body: {
      email: Joi.string().email({ tlds: false }).required(),
      password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).max(128)
        .required(),
      name: Joi.string().min(2).required(),
    },
  },
  async handler(req, res) {
    const { name, email, password } = req.body;
    await models.User.create({ name, email, password });
    res.json({ message: 'Successfully registered!' });
  },
};

export const user = {
  method: METHODS.GET,
  path: '/user',
  async handler(req, res) {
    res.json({ data: req.user });
  },
};
