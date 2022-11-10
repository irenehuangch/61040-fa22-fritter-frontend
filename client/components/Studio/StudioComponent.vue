<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<!-- Note: template and css for this modal component were based off of the example and code here: https://v2.vuejs.org/v2/examples/modal.html -->

<template>
  <article>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
              <h3>Fritter Studio</h3>
              <button class="modal-default-button" @click="closeStudio">
                Close
              </button>
          </div>
          <div class="modal-body">
            <header>
              <h3 class="author">
                @{{ freet.author ? freet.author : freet.authorId.username }}
              </h3>
              
            </header>
            <section>
              <div v-if="editing">
                <DropdownForm
                  v-if="editing"
                  :type="'Circle'"
                  :value="audience"
                  @changeCircle="this.changeCircle"
                />
              </div>
            </section>
            <section>
              <div v-if="editing" 
                  class="content">
                Content:
                <textarea
                  v-if="editing"
                  :value="draft"
                  @input="draft = $event.target.value"
                />
              </div>
              <div v-else>
                <div v-if="!font && !color">
                  <p
                    class="content"
                  >
                    {{ freet.content }}
                  </p>
                </div>
                <div v-else-if="font && color">
                  <p
                    class="content"
                    :style="{'font-family': font.toLowerCase(), 'color': color.toLowerCase()}"
                  >
                    {{ freet.content }}
                  </p>
                </div>
                <div v-else-if="font">
                  <p
                    class="content"
                    :style="{'font-family': font.toLowerCase()}"
                  >
                    {{ freet.content }}
                  </p>
                </div>
                <div v-else-if="color">
                  <p
                    class="content"
                    :style="{'color': color.toLowerCase()}"
                  >
                    {{ freet.content }}
                  </p>
                </div>
              </div>
            </section>
            <section>
              <div v-if="editing" class="studioItems">
                <FontForm
                  v-if="editing"
                  class="item"
                  :value="font"
                  @changeFont="this.changeFont"
                />
                <ColorForm
                  v-if="editing"
                  class="item"
                  :value="color"
                  @changeColor="this.changeColor"
                />
              </div>
            </section>
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
            <section class="alerts">
              <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
              >
                <p>{{ alert }}</p>
              </article>
            </section>
            <p class="info">
              Posted to {{ freet.circle }} at {{ freet.dateModified }}
              <i v-if="freet.edited">(edited)</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import FontForm from '@/components/Studio/FontForm.vue';
import ColorForm from '@/components/Studio/ColorForm.vue';
import DropdownForm from '@/components/Freet/DropdownForm.vue';

export default {
  name: 'StudioComponent',
  components: {FontForm, ColorForm, DropdownForm},
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
      prevFont: (this.freet.studio  && this.freet.studio.font) ? this.freet.studio.font : '',
      color: (this.freet.studio  && this.freet.studio.color) ? this.freet.studio.color : '',
      prevColor: (this.freet.studio  && this.freet.studio.color) ? this.freet.studio.color : '',
      alerts: {} // Displays success/error messages encountered during freet modification
    }
  },
  methods: {
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
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.$emit('close');
        }
      };
      this.request(params);
    },
    async submitEdit() {
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

      // edit the studio component
      const url = `/api/studio?freetId=${this.freet._id}`;
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }

      // if a studio component does not exist yet, create one
      if (!res.font) {
        const options = {
          method: 'POST', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({font: this.font, color: this.color})
        };

        try {
          const r2 = await fetch(url, options);
          const res2 = await r2.json();
          if (!r2.ok) {
            throw new Error(res.error);
          }

          this.editing = false;
          this.$emit('close');
          this.$emit('closeStudio');
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      } else {
        // otherwise, edit the existing one
        const options = {
          method: 'PUT', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({font: this.font, color: this.color})
        };

        try {
          const r2 = await fetch(url, options);
          const res2 = await r2.json();
          if (!r2.ok) {
            throw new Error(res.error);
          }

          this.editing = false;
          this.$emit('close');
          this.$emit('closeStudio');
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
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

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async closeStudio() {
      /**
        * Submits a form with the specified options from data().
        */
      if (this.editing === true) {
        const error = 'Error: Please save or discard your edits before exiting Fritter Studio.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      
      this.$emit('closeStudio', this.freet._id);
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
* {
  font-size: inherit;
}
.modal-mask {
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  /* font-family: Helvetica, Arial, sans-serif; */
}

.modal-header h3 {
  margin-top: 0;
  /* color: #42b983; */
}

.modal-body {
  margin: 20px 0;
}

.modal-body .alerts {
  position: relative;
}

.modal-default-button {
  float: right;
  width: 80;
  height: 25px;
  font-family: inherit;
  font-size: 16px;
  border-radius: 5px;
  color: black;
  background-color: #e3d8ed;
  border: 1px solid #e3d8ed;
  box-shadow: 1px 1px 1px 1px gray;
  margin-right: 5px;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
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

.studioItems {
  padding-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.item {
  padding-right: 10px;
  padding-bottom: 10px;
}

.content {
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

</style>
