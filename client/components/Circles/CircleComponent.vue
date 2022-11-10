<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
  >
    <header>
      <h2>
        {{ this.$store.state.circleFilter.circle_name }} Circle
      </h2>
      <UsersPopupButton 
        :list="this.$store.state.circleFilter.circle_usernames"
        :value="this.value"
      />
      <section 
        v-if="this.$store.state.circleFilter.circle_name !== 'public'"
        class="actions"
      >
        <AddUserForm
          class="addUser"
          :button="'Add user'"
          placeholder="Provide a username"
        />
        <button 
          class="leave"
          @click="deleteCircle"
        >
          Leave circle
        </button>
      </section>
    </header>
    <!-- <section>
      <UsersPopupButton 
        :list="this.$store.state.circleFilter.circle_usernames"
        :value="this.value"
      />
    </section> -->
    <section class="circle">
      <section>
        <NewFreetForm :public="false"/>
      </section>
      <section class="container">
        <h2>{{ this.$store.state.circleFilter.circle_name }} Feed</h2>
          <div v-if="this.$store.state.circleFilter.freets.length" class="circleFreets">
            <FreetComponent
              v-for="freet in this.$store.state.circleFilter.freets"
              :key="freet.id"
              :freet="freet"
              :public="false"
            />
          </div>
          <div
            v-else class="noFreets"
          >
            <h3>No freets found.</h3>
          </div>
      </section>
    </section>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import UsersPopupButton from '@/components/Circles/UsersPopupButton.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import NewFreetForm from '@/components/Freet/NewFreetForm.vue';
import AddUserForm from '@/components/Circles/AddUserForm.vue';

export default {
  name: 'CircleComponent',
  components: {UsersPopupButton, FreetComponent, NewFreetForm, AddUserForm},
  props: {
    // Data from the stored freet
    // circle: {
    //   type: Object,
    //   required: true
    // }
  },
  data() {
    return {
      value: `Users in ${this.$store.state.circleFilter.circle_name}`,
      username: null, // Username to add, if any
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    deleteCircle() {
      /**
       * Deletes this circle (leaves from this circle).
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Left circle', status: 'success'
          });
          this.$store.commit('refreshCircles');
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/circles/${this.$store.state.circleFilter.circle_name}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');
        if (this.$store.state.circleFilter) {
            this.$store.commit('refreshCircle');
            this.$store.commit('refreshCircleFreets');
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    
  }
};
</script>

<style scoped>
header > * {
  display: flex;
  justify-content: center;
}
.circle {
  display: grid;
  grid-gap: 3%;
  grid-template-columns: 27% 70%;
  margin-top: 3%;
}

section {
  display: flex;
  flex-direction: column;
}

.circleFreets {
  flex: 1 0 80vh;
  overflow-y: scroll;
  /* box-shadow: 2px 2px 2px 2px gray; */
  /* border: 1px solid #111;
  border-radius: 15px; */
}

.noFreets {
  padding-left: 3%;
}

.leave {
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

.actions{
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: center;
}

.container {
  border-radius: 15px;
  box-shadow: 2px 2px 2px 2px #b29dbf;
  padding: 3%;
  /* display: flex; */
  /* justify-content: center; */
  /* flex-direction: column; */
}

</style>
