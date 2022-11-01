import type {HydratedDocument, Types} from 'mongoose';
import type {Profile} from './model';
import ProfileModel from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';
import FollowersCollection from '../followers/collection';
import FreetCollection from '../freet/collection';
import UserModel from '../user/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class ProfileCollection {
  /**
   * Add a user profile given a user id
   *
   * @param {Types.ObjectId} user_id - The id of the user to create a profile for
   * @return {Promise<HydratedDocument<Profile>>} - The user's newly created profile
   */
  static async addOneByUserId(user_id: Types.ObjectId): Promise<HydratedDocument<Profile>> {
    const user = await UserCollection.findOneByUserId(user_id);
    const followers = await FollowersCollection.findAll(user_id);
    const freets = await FreetCollection.findAllByUsername(user.username);

    const profile = new ProfileModel({
      user: user._id,
      followers: followers._id,
      bio: '',
      freets: Array.from(freets, f => f._id)
    });
    await profile.save(); // Saves circle to MongoDB

    return profile;
  }

  /**
   * Add a user profile given a username
   *
   * @param {string} username- The username of the user to create a profile for
   * @return {Promise<HydratedDocument<Profile>>} - The user's newly created profile
   */
  static async addOneByUsername(username: string): Promise<HydratedDocument<Profile>> {
    const user = await UserCollection.findOneByUsername(username);
    const followers = await FollowersCollection.findAllByUsername(username);
    const freets = await FreetCollection.findAllByUsername(username);

    const profile = new ProfileModel({
      user: user._id,
      followers: followers._id,
      bio: '',
      freets: Array.from(freets, f => f._id)
    });
    await profile.save(); // Saves circle to MongoDB

    return profile;
  }

  /**
   * Find a profile by userId
   *
   * @param {Types.ObjectId | string} userId - The id the logged in user
   * @return {Promise<HydratedDocument<Profile>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Profile>> {
    return ProfileModel.findOne({user: userId});
  }

  /**
   * Find a profile by username
   *
   * @param {string} username - The username of the logged in user
   * @return {Promise<HydratedDocument<Profile>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<Profile>> {
    const user = await UserCollection.findOneByUsername(username);
    return ProfileModel.findOne({user: user._id});
  }

  /**
   * Update a user's profile
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} profileDetails - An object with the user's updated profile
   * @return {Promise<HydratedDocument<Profile>>} - The updated profile
   */
  static async updateOne(userId: Types.ObjectId | string, profileDetails: any): Promise<HydratedDocument<Profile>> {
    const profile = await ProfileCollection.findOneByUserId(userId);

    if (profileDetails.freet) { // Add a new freet id
      profile.freets.push(profileDetails.freet);
    }

    if (profileDetails.bio) {
      profile.bio = profileDetails.bio as string;
    }

    await profile.save();
    return profile;
  }

  /**
   * Delete a user's profile
   *
   * @param {Types.ObjectId | string} userId - The id of the user in session
   * @return {Promise<Boolean>} - true if the profile has been deleted, false otherwise
   */
  static async deleteOneProfile(userId: Types.ObjectId | string): Promise<boolean> {
    const deleted = await ProfileModel.deleteOne({user: userId});
    return deleted !== null;
  }
}

export default ProfileCollection;
