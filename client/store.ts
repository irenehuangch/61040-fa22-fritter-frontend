import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all),
    profileUsername: null, // Username to see profile for
    name: null,
    following: [],
    followers: [],
    bio: null,
    profileFreets: [],
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
    async refreshProfile(state) {
      const url = '/api/profile';
      const res = await fetch(url).then(async r => r.json());
      state.followers = res.followers;
      state.following = res.following;
      state.profileUsername = res.username; // Username to see profile for
      state.name = res.name;
      state.bio = res.bio;
      state.profileFreets = res.freets;
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
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
