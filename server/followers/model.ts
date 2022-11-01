import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Followers object
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Followers on the backend
export type Followers = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
};

export type PopulatedFollowers = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  followers: User[];
  following: User[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowersSchema = new Schema<Followers>({
  // User of which this object is referring to
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // List of users which each user follows
  followers: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  // List of users which follow each user
  following: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }]
});

const FollowersModel = model<Followers>('Followers', FollowersSchema);
export default FollowersModel;
