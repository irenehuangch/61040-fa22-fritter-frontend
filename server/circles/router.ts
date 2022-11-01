import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as circleValidator from './middleware';
import * as util from './util';
import CircleCollection from './collection';

const router = express.Router();

/**
 * Create a new circle for the logged in user
 *
 * @name POST /api/circles
 *
 * @param {string[]} usernames - The list of usernames for users in the circle
 * @param {string} circle_name - The name of the circle
 * @return {CircleResponse} - The created circle
 * @throws {403} - If the user is not logged in
 * @throws {400} - If no circle name is given
 * @throws {409} - If a circle already exists under the given name
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isValidNewName,
    circleValidator.isCircleNameAvailable
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const new_circle = await CircleCollection.addOneCircle(userId, req.body.circle_name);

    const response = await util.constructCircleResponse(new_circle);
    res.status(201).json({
      message: `Your circle ${req.body.circle_name as string} was created successfully.`,
      new_circle: response
    });
  }
);

/**
 * Get all the circles for the logged in user
 *
 * @name GET /api/circles
 *
 * @return {CircleResponse[]} - An array of freets created by user with id, authorId
 * @throws {403} - If user is not logged in
 *
 */
/**
 * Get a specific circle's info by circle name
 *
 * @name GET /api/circles?name=circle_name
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If no circle name is given
 * @throws {404} - If the user is not in the specified circle
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.name !== undefined) {
      next();
      return;
    }

    const all_circles = await CircleCollection.findAllByUserId(req.session.userId as string);
    const responses = await Promise.all(Array.from(all_circles, async circle => util.constructCircleResponse(circle)));
    res.status(200).json(responses);
  },
  [
    circleValidator.isValidExistingName
  ],
  async (req: Request, res: Response) => {
    const circle = await CircleCollection.findOneByCircleName(req.session.userId, req.query.name as string);
    if (!circle) {
      res.status(404).json({
        error: {
          circleNotFound: 'You do not currently have a circle under this name.'
        }
      });
      return;
    }

    const response = await util.constructCircleResponse(circle);
    res.status(200).json({
      message: 'Successfully retrived your circle information.',
      circle: response
    });
  }
);

/**
 * Delete (leave from) a circle
 *
 * @name DELETE /api/circles/:circle_name
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If no circle name is given
 * @throws {404} - If the circle does not exist for this user
 */
router.delete(
  '/:circle_name?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isValidExistingCircle,
    circleValidator.isUserInCircle
  ],
  async (req: Request, res: Response) => {
    await CircleCollection.deleteOneCircle(req.session.userId, req.params.circle_name);
    res.status(200).json({
      message: `You successfully left from circle ${req.params.circle_name}.`
    });
  }
);

/**
 * Modify a circle by adding a user
 *
 * @name PUT /api/circles/:circle_name
 *
 * @param {username} - The username of a follower to add
 * @return {CircleResponse} - the updated circle
 * @throws {403} - If the user is not logged in
 * @throws {400} - If no circle name or username is given
 * @throws {404} - If the logged in user is not in the circle, or if no account exists under the provided username
 * @throws {405} - If the username to be added is not a follower
 * @throws {409} - If the user to be added is already in the circle
 */
router.put(
  '/:circle_name?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isValidExistingCircle,
    circleValidator.isUserInCircle,
    circleValidator.isValidUsername
  ],
  async (req: Request, res: Response) => {
    const circle = await CircleCollection.addOneUser(req.session.userId, req.body.username, req.params.circle_name);
    const response = await util.constructCircleResponse(circle);
    res.status(200).json({
      message: `You successfully added ${req.body.username as string} to circle ${req.params.circle_name}`,
      circle: response
    });
  }
);

export {router as circlesRouter};
