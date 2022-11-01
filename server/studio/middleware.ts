import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import CircleCollection from '../circles/collection';
import StudioCollection from './collection';

/**
 * Checks if a freet with freetId is req.query exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = req.query.freetId as string;
  if (!freetId) {
    res.status(400).json({
      error: 'Please specify a freetId.'
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(freetId);
  const freet = validFormat ? await FreetCollection.findOne(freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a studio component exists for a freet with freetId
 */
const isStudioExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = req.query.freetId as string;
  const studio = await StudioCollection.findOneByFreetId(freetId);
  if (!studio) {
    res.status(404).json({
      error: {
        noStudioComponent: `No studio component has been created for freet with ID ${freetId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a studio component exists for a freet with freetId
 */
const isAlreadyCreated = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = req.query.freetId as string;
  const studio = await StudioCollection.findOneByFreetId(freetId);
  if (studio) {
    res.status(409).json({
      error: {
        alreadyCreated: `A studio component has already been created for freet with ID ${freetId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the studio in req.body is valid, i.e not all empty
 */
const isValidStudioContent = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req.body.font || req.body.color)) {
    res.status(400).json({
      error: 'Fields cannot be all empty.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.query.freetId as string);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' studio components.'
    });
    return;
  }

  next();
};

export {
  isStudioExists,
  isAlreadyCreated,
  isValidStudioContent,
  isFreetExists,
  isAuthor
};
