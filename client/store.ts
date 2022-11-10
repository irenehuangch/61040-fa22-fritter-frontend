import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    circleFilter: null, // Object circle to display info for, if one is selected (null = circles landing page)
    filter: null, // Username to filter shown freets by (null = show all),
    profileUsername: null, // Username to see profile for
    name: null,
    following: [],
    followers: [],
    bio: null,
    profileFreets: [],
    isFollowing: false, // Whether the logged in user follows the user currently being viewed
    circles: [], // All circles this user is a part of
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    updateName(state, name) {
      /**
       * Update the profile name to the specified name.
       * @param name - Name of the user to view profile for
       */
      state.name = name;
    },
    updateProfileUsername(state, profileUsername) {
      /**
       * Update the profile filter to the specified username.
       * @param profileUsername - Username of the user to view profile for
       */
      state.profileUsername = profileUsername;
    },
    updateFollowing(state, following) {
      /**
       * Update the stored following usernames to the provided ones.
       * @param following - following usernames to store
       */
      state.following = following;
    },
    updateFollowers(state, followers) {
      /**
       * Update the stored followers' usernames to the provided ones.
       * @param followers - Followers' usernames to store
       */
      state.followers = followers;
    },
    updateBio(state, bio) {
      /**
       * Update the stored bio to the provided bio.
       * @param bio - Bio to store
       */
      state.bio = bio;
    },
    updateProfileFreets(state, profileFreets) {
      /**
       * Update the stored user's profile with their public freets.
       * @param profileFreets - Public freets to store
       */
      state.profileFreets = profileFreets;
    },
    async getOriginalProfile(state) {
      state.profileUsername = null;
    },
    async refreshProfile(state) {
      const url = state.profileUsername ? `/api/profile?username=${state.profileUsername}` : '/api/profile';
      const res = await fetch(url).then(async r => r.json());
      state.followers = res.followers;
      state.following = res.following;
      state.profileUsername = res.username; // Username to see profile for
      state.name = res.name;
      state.bio = res.bio;

      const r2 = await fetch(`/api/freets?author=${res.username}`);
      const res2 = await r2.json();
      if (!r2.ok) {
        throw new Error(res2.error);
      }
      state.profileFreets = res2;
    },
    async refreshFollowers(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.profileUsername ? `/api/profile?username=${state.profileUsername}` : '/api/profile';
      const res = await fetch(url).then(async r => r.json());
      state.followers = res.followers;
      state.following = res.following;
    },
    async refreshBio(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.profileUsername ? `/api/profile?username=${state.profileUsername}` : '/api/profile';
      const res = await fetch(url).then(async r => r.json());
      state.bio = res.bio;
    },
    async setIsFollowing(state, username) {
      const url = '/api/followers';
      const res = await fetch(url).then(async r => r.json());
      state.isFollowing = res.followers.following.includes(username);
    },
    // setIsFollowing(state, username) {
    //   state.isFollowing = state.following.includes(username);
    // },
    updateCircles(state, circles) {
      /**
       * Update the stored circles with the provided circles.
       * @param circles - List of users the logged in user is in
       */
      state.circles = circles;
    },
    updateCircleFilter(state, circle) {
      /**
       * Update the stored circle with the provided one.
       * @param circle - Circle object
       */
      state.circleFilter = circle;
    },
    async refreshCircle(state) {
      const url = `/api/circles?name=${state.circleFilter.circle_name}`;
      const res = await fetch(url).then(async r => r.json());
      state.circleFilter = res.circle;
    },
    async refreshCircleFreets(state) {
      /**
       * Request the server for the currently available circle freets.
       */
      const url = `/api/circles?name=${state.circleFilter.circle_name}`;
      const res = await fetch(url).then(async r => r.json());
      state.freets = res.circle.freets;
    },
    async refreshCircles(state) {
      /**
       * Request the server for defaulting to the landing circles page.
       */
      const url = `/api/circles`;
      const res = await fetch(url).then(async r => r.json());
      state.circleFilter = null;
      state.circles = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
