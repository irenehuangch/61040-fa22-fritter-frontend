<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'AddUserForm',
  mixins: [InlineForm],
  data() {
    return {value: this.username, alerts: {}};
  },
  mounted() {
    this.value = '';
  },
  methods: {
    async submit() {
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: this.value}),
      };
      try {
        const r = await fetch(`/api/circles/${this.$store.state.circleFilter.circle_name}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit("refreshCircle");
        const message = `Successfully added @${this.value} to this circle!`;
        this.$store.commit('refreshCircle');
        this.$store.commit('refreshCircleFreets');
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
