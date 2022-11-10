<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <section>
    <label>{{ label }}:</label>
    <select v-model="selected" @change="$emit('changeSelection', $event.target.value)">
      <option v-for="opt in options" v-bind:value="opt.id">{{ opt.value }}</option>
    </select>
  </section>
</template>

<script>
export default {
  name: 'FontForm',
  props: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    propOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      label: this.type,
      selected: this.value,
      options: this.propOptions
    }
  }
};
</script>

<style scoped>
select {
  margin-left: 2px;
}

* {
  font-size: inherit;
}
</style>
