<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <StudioDropdown 
    :type="'Color'"
    :value="selectedColor"
    :propOptions="colorOptions"
    @changeSelection="this.changeColor"
  />
</template>

<script>
import StudioDropdown from '@/components/Studio/StudioDropdown.vue';

export default {
  name: 'ColorForm',
  components: {StudioDropdown},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedColor: this.value,
      colorOptions: [
        {
          "id": "Black",
          "value": "Black"
        },
        {
          "id": "Red",
          "value": "Red"
        },
        {
          "id": "Orange",
          "value": "Orange"
        },
        {
          "id": "Yellow",
          "value": "Yellow"
        },
        {
          "id": "Green",
          "value": "Green"
        },
        {
          "id": "Blue",
          "value": "Blue"
        },
        {
          "id": "Purple",
          "value": "Purple"
        },
        {
          "id": "Pink",
          "value": "Pink"
        }
      ]
    }
  },
  methods: {
    changeColor(value) {
      this.selectedColor = value;
      this.$emit('changeColor', this.selectedColor);
    }
  }
};
</script>

<style scoped>

</style>
