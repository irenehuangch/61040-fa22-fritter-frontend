<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <section class="container">
    <header>
      <h2>New Freet</h2>
    </header>
    <section class="newFreet">
      <div>
        <h3 class="left">
          @{{ $store.state.username }}
        </h3>
        <div class="right">
          <DropdownForm
            :type="'Circle'"
            :value="audience"
            @changeCircle="this.changeCircle"
          />
        </div>
      </div>
      <div>
        <label :for="'content'">Content:</label>
        <textarea
          :name="'content'"
          :value="draft"
          @input="draft = $event.target.value"
        />
      </div>
      <StudioButton 
        class="studioButton"
        :isNew="true" 
        :public="public" 
        @updateFreet="this.updateFreet"
      />
    </section>
    <button
      @click="createFreet"
      class="submitButton"
    >
      Freet!
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </section>
</template>

<script>
import StudioButton from '@/components/Studio/StudioButton.vue';
import DropdownForm from '@/components/Freet/DropdownForm.vue';

export default {
  name: 'NewFreetForm',
  components: {StudioButton, DropdownForm},
  props: {
    public: {
      type: Boolean,
      required: true
    }
  },
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      draft: '',
      audience: '',
      alerts: {}, // Displays success/error messages encountered during form submission
    };
  },
  methods: {
    updateFreet(freetId) {
      if (this.public === true) {
        this.$store.commit('refreshFreets');
      } else {
        this.$store.commit('refreshCircle');
        this.$store.commit('refreshCircleFreets');
      }
    },
    changeCircle(value) {
      this.audience = value;
    },
    async createFreet() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content: this.draft, circle_name: this.audience}),
      };

      try {
        const r = await fetch('/api/freets', options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.public === true) {
          this.$store.commit('refreshFreets');
        } else {
          this.$store.commit('refreshCircle');
          this.$store.commit('refreshCircleFreets');
        }
        
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.newFreet {
  /* border: 1px solid #111; */
  box-shadow: 2px 2px 2px 2px gray;
  border-radius: 15px;
  padding: 3%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 5%;
  width: 80%;
  position: relative;
  background-color: white;
}

.container {
  border-radius: 15px;
  box-shadow: 2px 2px 2px 2px #b29dbf;
  padding: 3%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* .container header {
  display: flex;
  flex-direction: column;
  justify-content: center;
} */

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 200px;
  width: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.studioButton {
  margin: 3% 0;
}

.submitButton {
  width: 150px;
  height: 50px;
  font-family: inherit;
  font-size: 20px;
  border-radius: 5px;
  color: black;
  background-color: #e3d8ed;
  border: 1px solid #e3d8ed;
  box-shadow: 1px 1px 1px 1px gray;
}
</style>
