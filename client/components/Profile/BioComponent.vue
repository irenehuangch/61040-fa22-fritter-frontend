<!-- Reusable component representing a single profile and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
  >
    <section>
      <div>
        Bio: 
        <span
          v-if="!editing"
          class="content"
        >
          {{ $store.state.bio }}
      </span>
      </div>
      <textarea
        v-if="editing"
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
      />
      
      <div
        v-if="$store.state.username === $store.state.profileUsername || !$store.state.profileUsername"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
      </div>
    </section>
    <section :class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <article>{{ alert }}</article>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'BioComponent',
  props: {
    // Data from the stored bio
    bio: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this bio is in edit mode
      draft: this.bio, // Potentially-new content for bio
      alerts: {} // Displays success/error messages encountered during bio modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on bio.
       */
      this.editing = true; // Keeps track of if a bio is being edited
      this.draft = this.bio; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode for bio.
       */
      this.editing = false;
      this.draft = this.bio;
    },
    submitEdit() {
      /**
       * Updates bio to have the submitted draft content.
       */
      if (this.bio === this.draft) {
        const error = 'Error: Edited bio content should be different than current bio.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        // console.log(this.alerts);
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully edited bio!',
        body: JSON.stringify({bio: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          this.$store.commit('updateBio', this.draft);
          this.draft = this.$store.state.bio;
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the profile endpoint
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
        const r = await fetch(`/api/profile`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshBio');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
</style>
