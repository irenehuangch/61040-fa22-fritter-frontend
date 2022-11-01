import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import type {Followers} from './model';
import FollowersModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Followers> is the output of the FollowersModel() constructor,
 * and contains all the information in Followers. https://mongoosejs.com/docs/typescript.html
 */
class FollowersCollection {
  /**
   * Add a new followers object
   *
   * @param {User} user - The user to create an object for
   * @return {Promise<HydratedDocument<Followers>>} - The newly created user
   */
  static async addOne(user: User): Promise<HydratedDocument<Followers>> {
    const followers = new FollowersModel({user: user._id, followers: [], following: []});
    await followers.save(); // Saves user to MongoDB
    return followers;
  }

  /**
   * Get all the following and followed users
   *
   * @return {Promise<HydratedDocument<Followers>>} - Followers object of the user
   */
  static async findAll(userId: Types.ObjectId): Promise<HydratedDocument<Followers>> {
    const self_followers = await FollowersModel.findOne({user: userId});
    return self_followers;
  }

  /**
   * Get all the following and followed users
   *
   * @return {Promise<HydratedDocument<Followers>>} - Followers object of the user
   */
  static async findAllByUsername(username: string): Promise<HydratedDocument<Followers>> {
    const user = await UserCollection.findOneByUsername(username);
    const followers = await FollowersModel.findOne({user: user._id});
    return followers;
  }

  /**
   * Find if a user is following someone
   *
   * @param {Types.ObjectId | string} userId - The id of the user
   * @param {string} other_username - The username of the other user
   * @return {Promise<boolean>} - Whether this user is following another given user
   */
  static async findOneFollowing(userId: Types.ObjectId | string, other_username: string): Promise<boolean> {
    const other_user = await UserCollection.findOneByUsername(other_username);
    const self_following = await FollowersModel.findOne({user: userId, following: other_user._id});

    return self_following !== null;
  }

  /**
   * Add a new user to current following, and add self to that user's followers
   *
   * @param {Types.ObjectId} self_id - The id of user in session
   * @param {string} other_username - The username of the other user to be followed
   * @return {Promise<HydratedDocument<Followers>>} - The updated followers object
   */
  static async addOneFollowing(self_id: Types.ObjectId, other_username: string): Promise<HydratedDocument<Followers>> {
    // Get User object for user to follow
    const other_user = await UserCollection.findOneByUsername(other_username);

    // Add to self's list of following users
    const self_followers = await FollowersModel.findOne({user: self_id});
    self_followers.following.push(other_user._id);
    // Add to other user's list of followers
    const other_followers = await FollowersModel.findOne({user: other_user._id});
    other_followers.followers.push(self_id);

    await self_followers.save(); // Saves followers to MongoDB
    await other_followers.save(); // Saves followers to MongoDB

    return self_followers;
  }

  /**
   * Unfollow a user
   *
   * @param {Types.ObjectId} self_id - The id of the user in session
   * @param {string} other_username - The username of the user to unfollow
   * @return {Promise<HydratedDocument<Followers>>} - The updated followers object
   */
  static async deleteOneFollowing(self_id: Types.ObjectId, other_username: string): Promise<HydratedDocument<Followers>> {
    // Get User object for user to unfollow
    const other_user = await UserCollection.findOneByUsername(other_username);

    // Remove the other user from this user's list of following users
    await FollowersModel.findOneAndUpdate(
      {user: self_id},
      {
        $pullAll: {
          following: [other_user._id]
        }
      }
    );

    // Remove this user from the other user's list of followers
    await FollowersModel.findOneAndUpdate(
      {user: other_user._id},
      {
        $pullAll: {
          followers: [self_id]
        }
      }
    );

    // Return updated followers object for this user
    const self_followers = await FollowersModel.findOne({user: self_id});
    return self_followers;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId): Promise<boolean> {
    const user = await FollowersModel.deleteOne({user: userId});

    // Remove this user from all users who follow this user
    await FollowersModel.updateMany(
      {following: [userId]},
      {
        $pullAll: {
          following: [userId]
        }
      }
    );

    // Remove this user from the followers list of all users who this user follows
    await FollowersModel.updateMany(
      {followers: [userId]},
      {
        $pullAll: {
          followers: [userId]
        }
      }
    );

    return user !== null;
  }
}

export default FollowersCollection;
