import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowersCollection from './collection';

/**
 * Checks if both self and other users in req.body exist
 */
const isValidToFollow = async (req: Request, res: Response, next: NextFunction) => {
  const self_id = req.session.userId as string;
  const other_username = req.body.other_username as string;

  if (!other_username) {
    res.status(400).json({error: 'Please input a username to follow.'});
    return;
  }

  const self = await UserCollection.findOneByUserId(
    self_id
  );

  if (self.username === other_username) {
    res.status(405).json({error: 'You cannot follow yourself.'});
    return;
  }

  const other = await UserCollection.findOneByUsername(
    other_username
  );

  if (self && other) {
    next();
  } else {
    res.status(404).json({error: 'No account currently exists with the provided username.'});
  }
};

/**
 * Checks if both self and other users in req.body exist
 */
const isValidUsername = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username) {
    res.status(400).json({error: 'Please input a username.'});
    return;
  }

  const user = await UserCollection.findOneByUsername(req.query.username as string);

  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.query.username as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if already following a user (to prevent double following)
 */
const isFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const self_id = req.session.userId as string;
  const other_username = req.body.other_username as string;

  if (!other_username) {
    res.status(400).json({error: 'Please input a username to follow.'});
    return;
  }

  const self_following = await FollowersCollection.findOneFollowing(self_id, other_username);

  if (self_following) {
    res.status(409).json({error: `Already following @${other_username}`});
  } else {
    next();
  }
};

/**
 * Checks if already following a user (to prevent double following)
 */
const isNotFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const self_id = req.session.userId as string;
  const other_username = req.body.other_username as string;

  if (!other_username) {
    res.status(400).json({error: 'Please input a username to follow.'});
    return;
  }

  const self_following = await FollowersCollection.findOneFollowing(self_id, other_username);

  if (self_following) {
    next();
  } else {
    res.status(409).json({error: `Already not following @${other_username}`});
  }
};

/**
 * Checks if the user is logged in, that is, whether the userId is set in session
 */
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(403).json({
      error: {
        auth: 'You must be logged in to complete this action.'
      }
    });
    return;
  }

  next();
};

export {
  isValidUsername,
  isValidToFollow,
  isUserLoggedIn,
  isFollowing,
  isNotFollowing
};
