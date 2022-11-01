import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Followers} from '../followers/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Circle
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Circle on the backend
export type Profile = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  followers: Types.ObjectId;
  bio: string;
  freets: Types.ObjectId[];
};

export type PopulatedProfile = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  followers: Followers;
  bio: string;
  freets: Freet[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ProfileSchema = new Schema<Profile>({
  // The user this profile pertains to
  user: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The followers this profile pertains to
  followers: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Followers'
  },
  // The bio of the user
  bio: {
    type: String,
    required: false
  },
  // The list of freets this user has authored
  freets: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }]
});

const ProfileModel = model<Profile>('Profile', ProfileSchema);
export default ProfileModel;
