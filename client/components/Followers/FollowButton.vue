<template>
  <article>
    <div v-if="$store.state.isFollowing">
      <button
        @click="unfollow"
      >
        Unfollow
      </button>
    </div>
    <div v-else>
      <button
        @click="follow"
      >
        Follow
      </button>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>

export default {
  name: 'FollowButton',
  data() {
    return {
      alerts: {}
    };
  },
  methods: {
    async follow() {
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({other_username: this.$store.state.profileUsername}),
      };
      try {
        const r = await fetch('/api/followers', options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setIsFollowing', this.$store.state.profileUsername);
        this.$store.commit('refreshProfile');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async unfollow() {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({other_username: this.$store.state.profileUsername}),
      };
      try {
        const r = await fetch('/api/followers', options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setIsFollowing', this.$store.state.profileUsername);
        this.$store.commit('refreshProfile');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
button {
  /* margin-right: 10px; */
  width: 80;
  height: 30px;
  font-family: inherit;
  font-size: 18px;
  border-radius: 5px;
  color: black;
  background-color: #e3d8ed;
  border: 1px solid #e3d8ed;
  box-shadow: 1px 1px 1px 1px gray;
}
</style>
