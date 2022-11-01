import type {Request, Response, NextFunction} from 'express';
import FollowersCollection from '../followers/collection';
import {Types} from 'mongoose';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import CircleCollection from './collection';

/**
 * Checks if a user is in a circle
 */
const isUserInCircle = async (req: Request, res: Response, next: NextFunction) => {
  const circle = await CircleCollection.findOneByCircleName(req.session.userId, req.params.circle_name ? req.params.circle_name : req.body.circle_name);
  if (!circle) {
    res.status(404).json({
      error: {
        circleNotFound: 'You do not currently have a circle under this name.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a circle already exists
 */
const isCircleNameAvailable = async (req: Request, res: Response, next: NextFunction) => {
  const circle_name = req.body.circle_name as string;
  const circle = await CircleCollection.findOneByCircleName(req.session.userId, circle_name);

  if (!circle) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      username: `You are already in a circle named ${circle_name}. Please choose another name.`
    }
  });
};

/**
 * Checks if a circle exists with the name in req.params
 */
const isValidExistingCircle = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.circle_name) {
    res.status(400).json({
      error: {
        name: 'Circle name must be a nonempty string.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a circle exists with the name in req.query
 */
const isValidExistingName = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.name.length === 0) {
    res.status(400).json({
      error: {
        name: 'Circle name must be a nonempty string.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a circle name in req.body is valid
 */
const isValidNewName = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.circle_name || req.body.circle_name.length === 0) {
    res.status(400).json({
      error: {
        name: 'Circle name must be a nonempty string.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if provided username is valid
 */
const isValidUsername = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username as string;

  // Cannot be an empty username
  if (!username) {
    res.status(400).json({error: 'Please input a username.'});
    return;
  }

  // Must be a valid user account
  const user = await UserCollection.findOneByUsername(username);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${username} does not exist.`
    });
    return;
  }

  // Can only add a user's followers
  const followers = await FollowersCollection.findAll(req.session.userId);
  const follower_usernames = await followers.populate<{followers: User[]}>({
    path: 'followers'
  }).then(m => m.followers.map(s => s.username));
  if (!follower_usernames.includes(username)) {
    res.status(405).json({
      error: 'You may only add followers to a circle.'
    });
    return;
  }

  // Prevent duplicate adding users
  const circle = await CircleCollection.findOneByCircleName(req.session.userId, req.params.circle_name);
  const circle_usernames = await circle.populate<{users: User[]}>({
    path: 'users'
  }).then(m => m.users.map(s => s.username));
  if (circle_usernames.includes(username)) {
    res.status(409).json({
      error: `@${username} is already in circle ${req.params.circle_name}.`
    });
    return;
  }

  next();
};

export {
  isUserInCircle,
  isCircleNameAvailable,
  isValidExistingName,
  isValidExistingCircle,
  isValidNewName,
  isValidUsername
};
