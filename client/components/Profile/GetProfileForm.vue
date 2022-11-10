<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetProfileForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.profileUsername, alerts: {}};
  },
  mounted() {
    this.value = '';
  },
  methods: {
    async submit() {
      const url = this.value ? `/api/profile?username=${this.value}` : '/api/profile';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateProfileUsername', this.value);
        this.$store.commit('updateName', res.name);
        this.$store.commit('updateFollowing', res.following);
        this.$store.commit('updateFollowers', res.followers);
        this.$store.commit('updateBio', res.bio);
        // this.$store.commit('updateProfileFreets', res.freets);
        this.$store.commit('setIsFollowing', this.value);

        const r2 = await fetch(this.value ? `/api/freets?author=${this.value}` : `/api/freets?author=${this.$store.state.username}`);
        const res2 = await r2.json();
        if (!r2.ok) {
          throw new Error(res2.error);
        }
        this.$store.commit('updateProfileFreets', res2);
      } catch (e) {
        if (this.value === this.$store.state.profileUsername) {
          // This section triggers if you search for a username but they
          // change their username when you refresh
          this.$store.commit('updateProfileUsername', null);
          this.value = ''; // Clear filter to show logged in user's profile
          this.$store.commit('refreshFollowers');
        } else {
          // Otherwise reset to previous 
          this.value = this.$store.state.profileUsername;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
