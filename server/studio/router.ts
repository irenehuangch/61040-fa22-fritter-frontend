import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import StudioCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as studioValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get studio freets for a given username
 *
 * @name GET /api/studio?username=username
 *
 * @return {StudioResponse[]} - An array of studio components created by username
 * @throws {403} - If user is not logged in
 * @throws {400} - If username is not given
 * @throws {404} - If no account exists under this username
 *
 */
/**
 * Get studio component of a freet
 *
 * @name GET /api/studio?freetId=freetId
 *
 * @return {StudioResponse} - The studio component for the specified freet
 * @throws {403} - If user is not logged in
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet with freetId exists or if no studio component exists
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    if (!req.query.username) {
      res.status(400).json({
        error: 'Provided username must be nonempty.'
      });
      return;
    }

    const username = req.query.username as string;
    const user = await UserCollection.findOneByUsername(username);
    if (!user) {
      res.status(404).json({
        error: 'No account exists under the provided username.'
      });
      return;
    }

    const all_studio = await StudioCollection.findAllByUsername(username);
    const response = all_studio.length > 0 ? await Promise.all(all_studio.map(async studio => util.constructStudioResponse(studio))) : [];

    res.status(200).json(response);
  },
  [
    studioValidator.isFreetExists,
    studioValidator.isStudioExists
  ],
  async (req: Request, res: Response) => {
    const studio = await StudioCollection.findOneByFreetId(req.query.freetId as string);
    const response = await util.constructStudioResponse(studio);
    res.status(200).json(response);
  }
);

/**
 * Create a studio component for a freet.
 *
 * @name POST /api/studio?freetId=freetId
 *
 * @param {string} font - The custom font name
 * @param {string} color - The custom color name
 * @return {StudioResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If freetId is empty
 * @throws {404} - If no freet with id freetId exists
 * @throws {409} - If the freet already has a studio component
 * @throws {403} - If the user is not the author of specified freet
 * @throws {400} - If the studio details are empty
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    studioValidator.isFreetExists,
    studioValidator.isAlreadyCreated,
    studioValidator.isAuthor,
    studioValidator.isValidStudioContent
  ],
  async (req: Request, res: Response) => {
    const freetId = (req.query.freetId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const studio = await StudioCollection.addOne(freetId, req.body);
    const response = await util.constructStudioResponse(studio);
    res.status(201).json({
      message: 'Your freet\'s studio component was created successfully.',
      studio: response
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/studio?freetId=freetId
 *
 * @param {freetId} - The id of the freet to delete a studio component for
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If freetId is empty
 * @throws {404} - If no freet with id freetId exists
 * @throws {409} - If the freet does not have a studio component
 * @throws {403} - If the user is not the author of the specified freet
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    studioValidator.isFreetExists,
    studioValidator.isStudioExists,
    studioValidator.isAuthor
  ],
  async (req: Request, res: Response) => {
    await StudioCollection.deleteOne(req.query.freetId as string);
    res.status(200).json({
      message: 'Your freet studio component was deleted successfully.'
    });
  }
);

/**
 * Modify the studio component of a freet
 *
 * @name PUT /api/studio?freetId=freetId
 *
 * @param {string} font - The custom font name
 * @param {string} color - The custom color name
 * @return {StudioResponse} - the updated studio component
 * @throws {403} - If the user is not logged in
 * @throws {400} - If freetId is empty
 * @throws {404} - If no freet with id freetId exists
 * @throws {409} - If the freet does not yet have a studio component
 * @throws {403} - If the user is not the author of specified freet
 * @throws {400} - If the studio details are empty
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    studioValidator.isFreetExists,
    studioValidator.isStudioExists,
    studioValidator.isValidStudioContent,
    studioValidator.isAuthor
  ],
  async (req: Request, res: Response) => {
    const studio = await StudioCollection.updateOne(req.query.freetId as string, req.body);
    const response = await util.constructStudioResponse(studio);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      studio: response
    });
  }
);

export {router as studioRouter};
