<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <StudioDropdown 
    :type="'Font'"
    :value="selectedFont"
    :propOptions="fontOptions"
    @changeSelection="this.changeFont"
  />
</template>

<script>
import StudioDropdown from '@/components/Studio/StudioDropdown.vue';

export default {
  name: 'FontForm',
  components: {StudioDropdown},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedFont: this.value,
      fontOptions: [
        {
          "id": "Arial",
          "value": "Arial"
        },
        {
          "id": "Helvetica",
          "value": "Helvetica"
        },
        {
          "id": "Times New Roman",
          "value": "Times New Roman"
        },
        {
          "id": "Georgia",
          "value": "Georgia"
        },
        {
          "id": "Courier",
          "value": "Courier"
        },
        {
          "id": "Apple Chancery",
          "value": "Apple Chancery"
        },
        {
          "id": "Snell Roundhand",
          "value": "Snell Roundhand"
        },
        {
          "id": "Chalkduster",
          "value": "Chalkduster"
        },
        {
          "id": "Impact",
          "value": "Impact"
        }
      ]
    }
  },
  methods: {
    changeFont(value) {
      this.selectedFont = value;
      this.$emit('changeFont', this.selectedFont);
    }
  }
};
</script>

<style scoped>

</style>
