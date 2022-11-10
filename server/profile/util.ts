import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Profile, PopulatedProfile} from './model';
import type {User} from '../user/model';
import type {Freet, PopulatedFreet} from '../freet/model';
import type {Followers, PopulatedFollowers} from '../followers/model';
import UserCollection from '../user/collection';
import FollowersCollection from '../followers/collection';
import { constructFreetResponse, type FreetResponse } from '../freet/util';
import StudioCollection from '../studio/collection';
import { constructStudioResponse } from '../studio/util';

// Update this if you add a property to the Freet type!
type ProfileResponse = {
  _id: string;
  name: string;
  username: string;
  followers: string[];
  following: string[];
  bio: string;
  freets: FreetResponse[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');


/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Profile>} profile - A profile object
 * @returns {ProfileResponse} - The freet object formatted for the frontend
 */
const constructProfileResponse = async (profile: HydratedDocument<Profile>): Promise<ProfileResponse> => {
  const profileCopy: PopulatedProfile = {
    ...profile.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  // Populate user account in session
  const user_obj = await profile.populate<{user: User}>({
    path: 'user'
  }).then(u => u.user);

  // Populate nested followers and following user usernames
  const followers_populated = await profile.populate<{followers: PopulatedFollowers}>({
    path: 'followers',
    populate: [
      {
        path: 'followers'
      },
      {
        path: 'following'
      }
    ]
  });
  const followers = followers_populated.followers.followers ? Array.from(
    followers_populated.followers.followers, user => user.username
  ) : [];
  const following = followers_populated.followers.following ? Array.from(
    followers_populated.followers.following, user => user.username
  ) : [];

  // Populate freets
  const freets = await profile.populate<{freets: PopulatedFreet[]}>({
    path: 'freets',
    populate: [
      {path:'authorId'}
    ]
  }).then(m => m.freets.filter(f => f.circle === 'public'));

  const formatFreets:FreetResponse[] = await Promise.all(freets.map(async f => {
    const studio = await StudioCollection.findOneByFreetId(f._id);
    const studioFormat = (studio !== null) ? await constructStudioResponse(studio) : null;

    return {
      ...f,
      _id: f._id.toString(),
      dateCreated: formatDate(f.dateCreated),
      dateModified: formatDate(f.dateModified),
      author: f.authorId.username,
      studio: studioFormat
    }
  }))

  return {
    _id: profileCopy._id.toString(),
    name: user_obj.name,
    username: user_obj.username,
    followers,
    following,
    bio: profileCopy.bio,
    freets: formatFreets
  };
};

export {
  constructProfileResponse
};
