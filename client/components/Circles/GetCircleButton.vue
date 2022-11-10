<!-- Form for getting freets (all, from user) (inline style) -->
<template>
  <article> 
    <section v-if="$store.state.circleFilter">
      <button  @click="back" >
        View all circles
      </button>
    </section>
    <section v-else >
      <button @click="submit" class="circleButton">
        {{ this.name }}
      </button>
    </section>
  </article>
</template>

<script>

export default {
  name: 'GetCircleButton',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {value: this.name, alerts: {}};
  },
  methods: {
    async back() {
      this.value = '';
      this.submit();
    },
    async submit() {
      const url = this.value ? `/api/circles?name=${this.value}` : '/api/circles';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        if (this.value) {
          this.$store.commit('updateCircleFilter', res.circle);
        //   this.$store.commit('updateFreets', res.circle.freets);
        } else {
          this.$store.commit('updateCircles', res);
        }
      } catch (e) {
        if (this.$store.state.circleFilter && this.value === this.$store.state.circleFilter.circle_name) {
          // This section triggers if you filter to a circle but its
          // name was changed when you refresh
          this.$store.commit('updateCircleFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshCircles');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.circleFilter.circle_name;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
  .circleButton {
    box-shadow: 2px 2px 2px 2px gray;
    background-color: #b29dbf;
    border-radius: 50%;
    border: none;
    color: white;
    padding: 20px;
    text-align: center;
    display: inline-block;
    height: 200px;
    width: 200px;
    font-size: 24px;
    margin: 15px;
    font-family: inherit;
  }
</style>