import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Followers, PopulatedFollowers} from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';

// Update this if you add a property to the User type!
type FollowersResponse = {
  _id: string;
  username: string;
  followers: string[]; // Array of usernames
  following: string[]; // Array of usernames
};

/**
 * Transform a raw Followers object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Followers>} followers - A followers object
 * @returns {FollowersResponse} - The followers object using usernames to represent
 */
const constructFollowersResponse = async (followers: HydratedDocument<Followers>): Promise<FollowersResponse> => {
  const followersCopy: PopulatedFollowers = {
    ...followers.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const self_username = await followers.populate<{user: User}>({
    path: 'user'
  }).then(m => m.user.username);

  const following_usernames = await followers.populate<{following: User[]}>({
    path: 'following'
  }).then(m => m.following.map(s => s.username));

  const follower_usernames = await followers.populate<{followers: User[]}>({
    path: 'followers'
  }).then(m => m.followers.map(s => s.username));

  return {
    _id: followersCopy._id.toString(),
    username: self_username,
    followers: follower_usernames,
    following: following_usernames
  };
};

export {
  constructFollowersResponse
};
