import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Profile, PopulatedProfile} from './model';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import type {Followers, PopulatedFollowers} from '../followers/model';
import UserCollection from '../user/collection';
import FollowersCollection from '../followers/collection';

// Update this if you add a property to the Freet type!
type ProfileResponse = {
  _id: string;
  name: string;
  username: string;
  followers: string[];
  following: string[];
  bio: string;
  freets: Freet[];
};

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
  const freets = await profile.populate<{freets: Freet[]}>({
    path: 'freets'
  }).then(m => m.freets);

  return {
    _id: profileCopy._id.toString(),
    name: user_obj.name,
    username: user_obj.username,
    followers,
    following,
    bio: profileCopy.bio,
    freets
  };
};

export {
  constructProfileResponse
};
