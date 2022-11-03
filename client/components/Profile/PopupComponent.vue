<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<!-- Note: template and css for this modal component were based off of the example and code here: https://v2.vuejs.org/v2/examples/modal.html -->

<template>
  <article>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
              {{ type }}
              <button class="modal-default-button" @click="$emit('close')">
                Close
              </button>
          </div>
          <div class="modal-body">
              <ul v-for="item in popupUsernames">
                <li>
                  <a href="/#/profile" @click="getProfile(item)">
                    {{ item }}
                  </a>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'PopupComponent',
  props: {
    usernames: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      type: this.value,
      popupUsernames: this.usernames
    };
  },
  methods: {
    async getProfile(username) {
      /**
       * Get profile of the selected user
       */
      const url = `/api/profile?username=${username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateProfileUsername', res.username);
        this.$store.commit('updateName', res.name);
        this.$store.commit('updateFollowing', res.following);
        this.$store.commit('updateFollowers', res.followers);
        this.$store.commit('updateBio', res.bio);
        this.$store.commit('updateProfileFreets', res.profileFreets);
        this.popupUsernames = this.type === 'Followers' ? res.followers : res.following;
        this.$emit('close');
      } catch (e) {
        if (this.value === this.$store.state.profileUsername) {
          // This section triggers if you search for a username but they
          // change their username when you refresh
          this.$store.commit('updateProfileUsername', null);
          this.type = ''; // Clear filter to show logged in user's profile
          this.$store.commit('refreshFollowers');
        } else {
          // Otherwise reset to previous fitler
          this.type = this.$store.state.profileUsername;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
