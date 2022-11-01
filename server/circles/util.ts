import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Circle, PopulatedCircle} from './model';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import FreetCollection from '../freet/collection';

// Update this if you add a property to the Freet type!
type CircleResponse = {
  _id: string;
  self_username: string;
  circle_usernames: string[];
  circle_name: string;
  freets: Freet[];
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Circle>} circle - A circle object
 * @returns {CircleResponse} - The freet object formatted for the frontend
 */
const constructCircleResponse = async (circle: HydratedDocument<Circle>): Promise<CircleResponse> => {
  const circleCopy: PopulatedCircle = {
    ...circle.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const self_username = await circle.populate<{user_self: User}>({
    path: 'user_self'
  }).then(m => m.user_self.username);

  const circle_usernames = await circle.populate<{users: User[]}>({
    path: 'users'
  }).then(m => m.users.map(s => s.username));

  const freets = await FreetCollection.findAllByCircle(circle.user_self, circleCopy.name);

  return {
    _id: circleCopy._id.toString(),
    self_username,
    circle_usernames,
    circle_name: circleCopy.name,
    freets
  };
};

export {
  constructCircleResponse
};
