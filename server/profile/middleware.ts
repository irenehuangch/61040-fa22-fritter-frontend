import type {Request, Response, NextFunction} from 'express';
import FollowersCollection from '../followers/collection';
import {Types} from 'mongoose';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import CircleCollection from './collection';

/**
 * Checks if provided username is valid
 */
const isValidUsername = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.query.username as string;

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

  next();
};

export {
  isValidUsername
};
