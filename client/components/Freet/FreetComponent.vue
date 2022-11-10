<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author ? freet.author : freet.authorId.username }}
      </h3>
    </header>
    <section >
      <div v-if="editing">
        <DropdownForm
          v-if="editing"
          class="edit"
          :type="'Circle'"
          :value="audience"
          @changeCircle="this.changeCircle"
        />
        <div class="edit">
          Content:
          <textarea
            v-if="editing"
            class="content"
            :value="draft"
            @input="draft = $event.target.value"
          />
        </div>
        
      </div>
      <div v-else>
        <p
          v-if="!freet.studio || (!freet.studio.font && !freet.studio.color)"
          class="edit"
        >
          {{ freet.content }}
        </p>
        <p
          v-else-if="freet.studio.font && freet.studio.color"
          class="edit"
          :style="{'font-family': freet.studio.font.toLowerCase(), 'color': freet.studio.color.toLowerCase()}"
        >
          {{ freet.content }}
        </p>
        <p
          v-else-if="freet.studio.font"
          class="edit"
          :style="{'font-family': freet.studio.font.toLowerCase()}"
        >
          {{ freet.content }}
        </p>
        <p
          v-else-if="freet.studio.color"
          class="edit"
          :style="{'color': freet.studio.color.toLowerCase()}"
        >
          {{ freet.content }}
        </p>
      </div>
      <div v-if="editing">
        <StudioButton
          class="studioButton"
          :isNew="false"
          :freet="freet"
          :public="public"
          @updateFreet="this.updateFreet"
        />
      </div>
    </section>
    <section>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
          class="actionButton"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
          class="actionButton"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
          class="actionButton"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet" class="actionButton">
          🗑️ Delete
        </button>
      </div>
    </section>
    <p class="info">
      Posted to {{ freet.circle }} at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
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
import FontForm from '@/components/Studio/FontForm.vue';
import ColorForm from '@/components/Studio/ColorForm.vue';
import DropdownForm from '@/components/Freet/DropdownForm.vue';
import StudioButton from '@/components/Studio/StudioButton.vue';

export default {
  name: 'FreetComponent',
  components: {FontForm, ColorForm, DropdownForm, StudioButton},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    public: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet,
      audience: this.freet.circle,
      font: (this.freet.studio  && this.freet.studio.font) ? this.freet.studio.font : '',
      prevFont: '',
      color: (this.freet.studio  && this.freet.studio.color) ? this.freet.studio.color : '',
      prevColor: '',
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    async updateFreet(freetId) {
      this.editing = false;
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
    changeFont(value) {
      this.font = value;
    },
    changeColor(value) {
      this.color = value;
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
      this.audience = this.freet.circle;
      this.prevFont = this.font;
      this.prevColor = this.color;
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
      this.audience = this.freet.circle;
      this.font = this.prevFont;
      this.color = this.prevColor;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (
        (this.freet.content === this.draft) && (this.freet.circle === this.audience) && 
        (this.font === this.prevFont) && (this.color === this.prevColor)
      ) {
        const error = 'Error: Edited freet details should be different than current freet details.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft, circle_name: this.audience}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        if (this.public === true) {
          this.$store.commit('refreshFreets');
        } else {
          this.$store.commit('refreshCircle');
          this.$store.commit('refreshCircleFreets');
        }

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
.freet {
    /* border: 1px solid #111; */
    border-radius: 15px;
    box-shadow: 2px 2px 2px 2px gray;
    padding: 20px;
    position: relative;
    margin-top: 2%;
    margin-bottom: 2%;
    margin-left: 3%;
    margin-right: 3%;
    background-color: white;
}

.edit {
  margin: 10px 0;
}

.actionButton {
  margin-top: 2%;
  width: 80;
  height: 30px;
  font-family: inherit;
  font-size: 16px;
  border-radius: 5px;
  color: black;
  background-color: #e3d8ed;
  border: 1px solid #e3d8ed;
  box-shadow: 1px 1px 1px 1px gray;
  margin-right: 5px;
}

.content {
  border-radius: 5px;
  font-size: inherit;
}
</style>
