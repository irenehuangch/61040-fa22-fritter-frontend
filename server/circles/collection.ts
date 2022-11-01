import type {HydratedDocument, Types} from 'mongoose';
import type {Circle} from './model';
import CircleModel from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class CircleCollection {
  /**
   * Add a circle for a specified user
   *
   * @param {Types.ObjectId | string} self_id - The user object to create a circle for
   * @param {string} name - The name of the circle
   * @return {Promise<HydratedDocument<Circle>>} - The user's newly created circle
   */
  static async addOneCircle(self_id: Types.ObjectId | string, name: string): Promise<HydratedDocument<Circle>> {
    const users_ids = [self_id];

    const circle = new CircleModel({user_self: self_id, users: users_ids, name, freets: []});
    await circle.save(); // Saves circle to MongoDB

    return circle;
  }

  /**
   * Find a circle by circleId
   *
   * @param {Types.ObjectId | string} userId - The id the logged in user
   * @param {Types.ObjectId | string} circleId - The id of the circle to find
   * @return {Promise<HydratedDocument<Circle>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOneByCircleId(userId: Types.ObjectId | string, circleId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    return CircleModel.findOne({_id: circleId, user_self: userId});
  }

  /**
   * Find a circle by circle name
   *
   * @param {Types.ObjectId | string} userId - The id the logged in user
   * @param {string} circle_name - The name of the circle to find
   * @return {Promise<HydratedDocument<Circle>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOneByCircleName(userId: Types.ObjectId | string, circle_name: string): Promise<HydratedDocument<Circle>> {
    return CircleModel.findOne({user_self: userId, name: circle_name});
  }

  /**
   * Get all of a user's circles (in alphabetical order) in the database
   *
   * @param {string} userId - The id the logged in user
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of a user's circles
   */
  static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Circle>>> {
    // Retrieves circles and sorts them in alphabetical order
    return CircleModel.find({user_self: userId}).sort({name: 1});
  }

  /**
   * Get all the circles for a given username
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Circle>>> {
    const user = await UserCollection.findOneByUsername(username);
    return CircleModel.find({user_self: user._id}).populate('user_self');
  }

  /**
   * Update a circle with a new user
   *
   * @param {Types.ObjectId | string} userId - The id of the user in session
   * @param {string} username - The new username to add
   * @param {string} circle_name - The name of the circle to update
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
  static async addOneUser(userId: Types.ObjectId | string, username: string, circle_name: string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({user_self: userId, name: circle_name});
    const user_to_add = await UserCollection.findOneByUsername(username);

    const new_userIds = circle.users; // Update list of users to add new user id
    new_userIds.push(user_to_add._id);

    // Update circle for all the other users in this circle
    await CircleModel.updateMany(
      {name: circle_name},
      {
        $push: {
          users: [user_to_add._id]
        }
      }
    );

    // Create a circle for the added user
    const new_circle = new CircleModel({user_self: user_to_add._id, users: new_userIds, name: circle_name});
    await new_circle.save();

    return circle;
  }

  /**
   * Add a user to all user's public circles
   *
   * @param {Types.ObjectId | string} userId - The id of the user in session
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async updateMany(userId: Types.ObjectId | string): Promise<boolean> {
    const updated = await CircleModel.updateMany(
      {name: 'public'},
      {
        $push: {
          users: [userId]
        }
      }
    );

    return updated !== null;
  }

  /**
   * Delete (leave) a circle
   *
   * @param {Types.ObjectId | string} userId - The id of the user in session
   * @param {string} circle_name - The name of the circle to leave
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOneCircle(userId: Types.ObjectId | string, circle_name: string): Promise<boolean> {
    // Update circle for all the other users in this circle
    await CircleModel.updateMany(
      {name: circle_name},
      {
        $pullAll: {
          users: [userId]
        }
      }
    );

    // Delete this circle from the logged in user's circles
    const circle_deleted = await CircleModel.deleteOne({user_self: userId, name: circle_name});
    return circle_deleted !== null;
  }

  /**
   * Delete (leave) a circle
   *
   * @param {Types.ObjectId | string} userId - The id of the user in session
   * @param {string} circle_name - The name of the circle to leave
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<boolean> {
    // Update circle for all the other users in a circle
    const pulled = await CircleModel.updateMany(
      {users: [userId]},
      {
        $pullAll: {
          users: [userId]
        }
      }
    );

    // Delete all of this user's circles
    const circle_deleted = await CircleModel.deleteMany({user_self: userId});
    return pulled !== null && circle_deleted !== null;
  }
}

export default CircleCollection;
