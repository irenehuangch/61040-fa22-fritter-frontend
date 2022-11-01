import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Studio = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  font: string;
  color: string;
  dateModified: Date;
};

export type PopulatedStudio = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  font: string;
  color: string;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const StudioSchema = new Schema<Studio>({
  // The corresponding freet id
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The custom font to use for the freet
  font: {
    type: String,
    required: false
  },
  // The custom color to use for the freet
  color: {
    type: String,
    required: false
  },
  // The date of the most recent modification/creation
  dateModified: {
    type: Date,
    required: true
  }
});

const StudioModel = model<Studio>('Studio', StudioSchema);
export default StudioModel;
