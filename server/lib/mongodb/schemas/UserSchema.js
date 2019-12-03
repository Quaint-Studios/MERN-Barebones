import * as mongoose from 'mongoose';
import { required } from './SchemaTemplate';

/**
 * User Schema
 * @property {string} id An ID number to identify the user by.
 */
const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, required }
});

// eslint-disable-next-line func-names
UserSchema.methods.getData = function () {
  return {
    id: this.id,
    name: this.name
  };
};

export const UserModel = mongoose.model('user', UserSchema);
