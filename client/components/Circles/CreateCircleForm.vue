<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateCircleForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/circles',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'circle_name', label: 'Circle Name', value: ''}
      ],
      title: 'New Circle',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a circle!';
        this.$store.commit('refreshCircles');
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
