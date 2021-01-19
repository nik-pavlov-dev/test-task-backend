/* eslint-disable func-names */
import { Schema, model } from 'mongoose';
import softDelete from 'mongoose-delete';
import bcrypt from 'bcrypt';

import config from '../config';

export const MODEL_NAME = 'User';

const SCHEMA = {
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
};

const User = new Schema(SCHEMA, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

User.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, config.app.salt);
  }
  next();
});

User.virtual('displayName').get(function () {
  return (`${this.first_name} ${this.last_name}`).trim();
});

User.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    created_at: this.created_at,
    updated_at: this.updated_at,
    deleted_at: this.deleted_at,
  };
};

User.plugin(softDelete, { overrideMethods: ['count', 'countDocuments', 'find', 'findOne'] });

export default model(MODEL_NAME, User);
