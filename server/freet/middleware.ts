import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import CircleCollection from '../circles/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetUpdate = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req.body.content || req.body.circle_name)) {
    res.status(404).json({
      error: {
        circleNotFound: 'Content and circle name cannot both be empty.'
      }
    });
    return;
  }

  if (req.body.content.length > 0) {
    const content = req.body.content as string;
    if (!content.trim()) {
      res.status(400).json({
        error: 'Freet content must be at least one character long.'
      });
      return;
    }

    if (content.length > 140) {
      res.status(413).json({
        error: 'Freet content must be no more than 140 characters.'
      });
      return;
    }
  }

  if (req.body.circle_name.length > 0) {
    const circle = req.body.circle_name as string;
    const circle_obj = await CircleCollection.findOneByCircleName(req.session.userId, circle);
    if (!circle_obj) {
      res.status(404).json({
        error: {
          circleNotFound: 'You do not currently have a circle under this name.'
        }
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

export {
  isValidFreetContent,
  isValidFreetUpdate,
  isFreetExists,
  isValidFreetModifier
};
