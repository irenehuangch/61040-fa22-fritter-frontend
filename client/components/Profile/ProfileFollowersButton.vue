<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <button
      @click="openPopup"
    >
      {{ list ? list.length : 0 }} {{ this.value }}
    </button>
    <PopupComponent 
      v-if="this.isOpen == true" 
      @close="closePopup" 
      :usernames="list" 
      :value="this.value"      
    />
  </article>
</template>

<script>
import PopupComponent from '@/components/Profile/PopupComponent.vue';

export default {
  name: 'ProfileFollowersButton',
  components: {PopupComponent},
  props: {
    // Data from the profile page
    value: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false, // denotes whether popup is shown or not
      usernames: this.list // List of usernames to display
    };
  },
  methods: {
    openPopup() {
      this.isOpen = true;
    },
    closePopup() {
      this.isOpen = false;
    }
  }
};
</script>

<style scoped>
</style>
