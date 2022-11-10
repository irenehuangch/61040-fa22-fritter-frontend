<template>
  <article>
    <button
      @click="openPopup"
    >
      Fritter Studio
    </button>
    <div v-if="this.isOpen == true">
      <NewStudioForm 
        v-if="isNew == true" 
        @close="closePopup"
        :public="public"
        @closeStudio="this.updateFreet"
      />
      <StudioComponent 
        v-else 
        @close="closePopup"
        :freet="freet"
        :public="public"
        @closeStudio="this.updateFreet"
      />
    </div>
  </article>
</template>

<script>
import NewStudioForm from '@/components/Studio/NewStudioForm.vue';
import StudioComponent from '@/components/Studio/StudioComponent.vue';

export default {
  name: 'StudioButton',
  components: {NewStudioForm, StudioComponent},
  props: {
    isNew: {
      type: Boolean,
      required: true
    },
    public: {
      type: Boolean,
      required: true
    },
    freet: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      isOpen: false, alerts: {} // denotes whether popup is shown or not
    };
  },
  methods: {
    openPopup() {
      this.isOpen = true;
    },
    closePopup() {
      this.isOpen = false;
    },
    updateFreet(id) {
      if (this.public === true) {
        this.$store.commit('refreshFreets');
      } else {
        this.$store.commit('refreshCircle');
        this.$store.commit('refreshCircleFreets');
      }
      this.$emit('updateFreet', id);
    }
  }
};
</script>

<style scoped>
button {
  font-family: inherit;
  font-size: 18px;
  border-radius: 5px;
  color: black;
  background-color: #e3d8ed;
  border: 1px solid #e3d8ed;
  box-shadow: 1px 1px 1px 1px gray;
  width: 120px;
  height: 30px;
}
</style>
