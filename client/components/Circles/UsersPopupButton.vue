<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <button
      @click="openPopup"
    >
      {{ list ? list.length : 0 }} {{ this.value }}
    </button>
    <UsersPopup 
      v-if="this.isOpen == true" 
      @close="closePopup" 
      :usernames="list" 
      :value="this.value"      
    />
  </article>
</template>

<script>
import UsersPopup from '@/components/Circles/UsersPopup.vue';

export default {
  name: 'UsersPopupButton',
  components: {UsersPopup},
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
button {
  margin-left: 10px;
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
