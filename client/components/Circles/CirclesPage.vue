<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.circleFilter" class="allCircles" >
        <button @click="$store.commit('refreshCircles')">
          View all circles
        </button>
    </section>
    <section>
      <header>
        <div><h2 v-if="!$store.state.circleFilter">My Circles</h2></div>
        <div v-if="!$store.state.circleFilter">
          <CreateCircleForm />
        </div>
      </header>
    </section>
    <section v-if="$store.state.circleFilter" >
      <!-- <button @click="$store.commit('refreshCircles')">
        View all circles
      </button> -->
      <CircleComponent 
      />
    </section>
    <section 
      v-else
      class="row"
    >
      <div v-for="item in $store.state.circles">
        <GetCircleButton
          ref="getCircleButton"
          :name="item.circle_name"
        />
      </div>
    </section>
  </main>
</template>

<script>
import CreateCircleForm from '@/components/Circles/CreateCircleForm.vue';
import GetCircleButton from '@/components/Circles/GetCircleButton.vue';
import CircleComponent from '@/components/Circles/CircleComponent.vue';

export default {
  name: 'CirclesPage',
  components: {GetCircleButton, CircleComponent, CreateCircleForm},
  mounted() {
    this.$store.commit('refreshCircles')
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header > * {
    display: flex;
    justify-content: center;
}

button {
  margin-right: 10px;
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

.allCircles {
  width: 15%;
  margin-top: 3%;
}

.row {
  margin-top: 3%;
  flex-direction: row;
  overflow-x: scroll;
  /* justify-content: center; */
}


</style>
