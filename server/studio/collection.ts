import type {HydratedDocument, Types} from 'mongoose';
import type {Studio} from './model';
import StudioModel from './model';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class StudioCollection {
  /**
   * Initialize a studio component to a freet
   *
   * @param {Types.ObjectId | string} freetId - The id of the corresponding freet
   * @param {any} studioDetails - The object with the studio content
   * @return {Promise<HydratedDocument<Studio>>} - The newly created freet
   */
  static async addOne(freetId: Types.ObjectId | string, studioDetails: any): Promise<HydratedDocument<Studio>> {
    const studio = new StudioModel({freetId});

    if (studioDetails.font) {
      studio.font = studioDetails.font as string;
    }

    if (studioDetails.color) {
      studio.color = studioDetails.color as string;
    }

    studio.dateModified = new Date();

    await studio.save(); // Saves studio object to MongoDB

    const freet = await FreetCollection.findOne(freetId);
    freet.dateModified = studio.dateModified;
    await freet.save();

    return studio.populate('freetId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Studio>> | Promise<null> } - The studio component for the given freetId, if any
   */
  static async findOneByFreetId(freetId: Types.ObjectId | string): Promise<HydratedDocument<Studio>> {
    return StudioModel.findOne({freetId}).populate('freetId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Studio>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Studio>>> {
    const freets = await FreetCollection.findAllByUsername(username);
    const ids = freets.length > 0 ? Array.from(freets, f => f._id) : [];
    return ids.length > 0 ? StudioModel.find({freetId: [ids]}) : [];
  }

  /**
   * Update a freet's studio component with the new content
   *
   * @param {Types.ObjectId | string} freetId - The id of the freet to be updated
   * @param {any} studioDetails - The new details of the studio component
   * @return {Promise<HydratedDocument<Studio>>} - The newly updated Studio
   */
  static async updateOne(freetId: Types.ObjectId | string, studioDetails: any): Promise<HydratedDocument<Studio>> {
    const studio = await StudioModel.findOne({freetId});

    if (studioDetails.font) {
      studio.font = studioDetails.font as string;
    }

    if (studioDetails.color) {
      studio.color = studioDetails.color as string;
    }

    studio.dateModified = new Date();
    await studio.save();

    const freet = await FreetCollection.findOne(freetId);
    freet.dateModified = studio.dateModified;
    await freet.save();

    return studio.populate('freetId');
  }

  /**
   * Delete a freet's studio component.
   *
   * @param {Types.ObjectId | string} freetId - The freetId of freet to delete studio component from
   * @return {Promise<Boolean>} - true if the studio component has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const studio = await StudioModel.deleteOne({freetId});

    const freet = await FreetCollection.findOne(freetId);
    freet.dateModified = new Date();
    await freet.save();

    return studio !== null;
  }

  /**
   * Delete all of a user's freets/studio freets.
   *
   * @param {Types.ObjectId | string} userId - The user to delete all freets for
   * @return {Promise<Boolean>} - true if the studio component has been deleted, false otherwise
   */
  static async deleteAll(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserCollection.findOneByUserId(userId);
    const freets = await FreetCollection.findAllByUsername(user.username);
    if (!freets || freets.length === 0) {
      return true;
    }

    const ids = freets.map(f => f._id);
    const deleted = await StudioModel.deleteMany({freetId: [ids]});
    return deleted !== null;
  }
}

export default StudioCollection;
