import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowersCollection from './collection';

import * as followersValidator from './middleware';
import * as util from './util';

const router = express.Router();
/**
 * Get all the followers for the logged in user
 *
 * @name GET /api/followers
 *
 * @return {FollowersResponse} - The requested user's followers object
 * @throws {403} - If user is not logged in
 */
/**
 * Get all the followers for a requested user
 *
 * @name GET /api/followers?username=username
 *
 * @return {FollowersResponse} - The requested user's followers object
 * @throws {400} - If no username provided
 * @throws {404} - If no account exists for the provided username
 *
 */
router.get(
  '/',
  [
    followersValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.username !== undefined) {
      next();
      return;
    }

    const followers = await FollowersCollection.findAll(req.session.userId);
    const response = await util.constructFollowersResponse(followers);

    res.status(200).json({
      message: 'Successfully retrieved your followers',
      followers: response
    });
  },
  [
    followersValidator.isValidUsername
  ],
  async (req: Request, res: Response) => {
    const username = req.query.username as string;
    const followers = await FollowersCollection.findAllByUsername(username);
    const response = await util.constructFollowersResponse(followers);

    res.status(200).json({
      message: `Successfully retrieved followers for @${username}`,
      followers: response
    });
  }
);

/**
 * Update a user's list of following users
 *
 * @name PUT /api/followers
 *
 * @param {string} other_username - Another user's username
 * @return {FollowersResponse} - The updated user's followers object
 * @throws {400} - If no username is provided
 * @throws {403} - If user is not logged in
 * @throws {404} - If no account exists with the specified username to follow
 * @throws {405} - If if the username of the user to follow is the same as the user's own username (cannot follow oneself)
 * @throws {409} - If the user to be followed is already being followed
 */
router.put(
  '/',
  [
    followersValidator.isUserLoggedIn,
    followersValidator.isValidToFollow,
    followersValidator.isFollowing
  ],
  async (req: Request, res: Response) => {
    const followers = await FollowersCollection.addOneFollowing(req.session.userId, req.body.other_username);
    const response = await util.constructFollowersResponse(followers);

    res.status(200).json({
      message: 'Your following/followers was updated successfully.',
      followers: response
    });
  }
);

/**
 * Delete a user from a list of followers
 *
 * @name DELETE /api/followers
 *
 * @param {string} other_username - Another user's username
 * @return {string} - A success message
 * @throws {400} - If no username is provided
 * @throws {403} - If user is not logged in
 * @throws {404} - If no account exists with the specified username to unfollow
 * @throws {405} - If if the username of the user to unfollow is the same as the user's own username (cannot follow oneself)
 * @throws {409} - If the user to be followed is already not followed
 */
router.delete(
  '/',
  [
    followersValidator.isUserLoggedIn,
    followersValidator.isValidToFollow,
    followersValidator.isNotFollowing
  ],
  async (req: Request, res: Response) => {
    const followers = await FollowersCollection.deleteOneFollowing(req.session.userId, req.body.other_username);
    const response = await util.constructFollowersResponse(followers);

    res.status(200).json({
      message: `Unfollowed @${req.body.other_username as string}`,
      followers: response
    });
  }
);

export {router as followersRouter};
