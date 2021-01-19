import Joi from '@hapi/joi';
import { notFound } from '@hapi/boom';
import { models } from 'mongoose';

import { METHODS } from '../../config/constants';
import { assert } from '../../helpers';

export const getUsers = {
  method: METHODS.GET,
  path: '/users',
  validate: {
    query: {
      skip: Joi.number().integer().min(0).default(0),
      limit: Joi.number().integer().min(1).default(10),
    },
  },
  async handler(req, res) {
    const { skip, limit } = req.query;
    const users = await models.User.find({ _id: { $ne: req.user._id } }).skip(skip).limit(limit);
    const total = await models.User.countDocuments();
    res.json({ data: users, total });
  },
};

export const getUser = {
  method: METHODS.GET,
  path: '/users/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  async handler(req, res) {
    const user = await models.User.findOne({ _id: req.params.id });
    assert(user, notFound, 'User not found');
    res.json({ data: user });
  },
};

export const deleteUser = {
  method: METHODS.DELETE,
  path: '/users/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  async handler(req, res) {
    const user = await models.User.findOne({ _id: req.params.id });
    assert(user, notFound, 'User not found');
    await user.delete();
    res.json({ data: user });
  },
};
