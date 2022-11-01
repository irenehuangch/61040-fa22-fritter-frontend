import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Circle
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Circle on the backend
export type Circle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user_self: Types.ObjectId;
  users: Types.ObjectId[];
  name: string;
  freets: Types.ObjectId[];
};

export type PopulatedCircle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user_self: User;
  users: User[];
  name: string;
  freets: Freet[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CircleSchema = new Schema<Circle>({
  // The author userId
  user_self: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The list of users in this circle
  users: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  // The name of the circle
  name: {
    type: String,
    required: true
  },
  // The list of freets in this circle
  freets: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }]
});

const CircleModel = model<Circle>('Circle', CircleSchema);
export default CircleModel;
