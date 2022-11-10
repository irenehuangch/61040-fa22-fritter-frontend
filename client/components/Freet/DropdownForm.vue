<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <section>
    <label>{{ type }}:</label>
    <select v-model="selected" @change="$emit('changeCircle', $event.target.value)">
      <option v-for="opt in options" v-bind:value="opt.id">{{ opt.value }}</option>
    </select>
  </section>
</template>

<script>
export default {
  name: 'DropdownForm',
  props: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selected: this.value,
      options: this.$store.state.circles.map(circle => {
        return {
          id: circle.circle_name,
          value: circle.circle_name
        }
      })
    }
  }
};
</script>

<style scoped>
select {
  margin-left: 2px;
  border-radius: 5px;
  font-family: inherit;
  font-size: inherit;
}
</style>
