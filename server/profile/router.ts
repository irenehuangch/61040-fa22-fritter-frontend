import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ProfileCollection from './collection';
import * as userValidator from '../user/middleware';
import * as profileValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a new profile for the logged in user
 *
 * @name POST /api/profile
 *
 * @return {ProfileResponse} - The created profile
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const profile = await ProfileCollection.addOneByUserId(req.session.userId);

    const response = await util.constructProfileResponse(profile);
    res.status(201).json({
      message: 'Your profile was created successfully.',
      profile: response
    });
  }
);

/**
 * Get profile for the user in session
 *
 * @name GET /api/profile
 *
 * @return {ProfileResponse} - An object with user's profile information
 * @throws {403} - If user is not logged in
 *
 */
/**
 * Get a specific user's profile by username
 *
 * @name GET /api/profile?username=username
 *
 * @param {username} - username of the user profile to retrieve
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If no username is given
 * @throws {404} - If the user does not exist
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.username !== undefined) {
      next();
      return;
    }

    const profile = await ProfileCollection.findOneByUserId(req.session.userId);
    const response = await util.constructProfileResponse(profile);
    res.status(200).json(response);
  },
  [
    profileValidator.isValidUsername
  ],
  async (req: Request, res: Response) => {
    const profile = await ProfileCollection.findOneByUsername(req.query.username as string);
    const response = await util.constructProfileResponse(profile);
    res.status(200).json({
      message: 'Successfully retrived your circle information.',
      profile: response
    });
  }
);

/**
 * Modify a profile
 *
 * @name PUT /api/profile
 *
 * @param {bio} - Updated bio content
 * @param {freet} - Additional freet id to add
 * @return {ProfileResponse} - The updated profile
 * @throws {403} - If the user is not logged in
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const profile = await ProfileCollection.updateOne(userId, req.body);
    const response = await util.constructProfileResponse(profile);
    res.status(200).json({
      message: 'Your account was updated successfully.',
      profile: response
    });
  }
);

export {router as profileRouter};
