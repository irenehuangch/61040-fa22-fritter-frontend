<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<!-- Note: template and css for this modal component were based off of the example and code here: https://v2.vuejs.org/v2/examples/modal.html -->

<template>
  <article>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
              Fritter Studio
              <button class="modal-default-button" @click="$emit('close')">
                Close
              </button>
          </div>
          <div class="modal-body">
            <section>
              <h3 class="left">
                @{{ $store.state.username }}
              </h3>
              <DropdownForm
                  :type="'Circle'"
                  :value="audience"
                  @changeCircle="this.changeCircle"
              />
              <div class="content">
                <label :for="'content'">Content:</label>
                <textarea
                  :name="'content'"
                  :value="draft"
                  @input="draft = $event.target.value"
                />
              </div>
              <section class="studioItems">
                <FontForm 
                  @changeFont="this.changeFont"
                  :value="''"
                  class="item"
                />
                <ColorForm 
                  @changeColor="this.changeColor"
                  :value="''"
                  class="item"
                />
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
            </section>
            <button
              @click="this.createFreet"
            >
              Freet!
            </button>
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
  name: 'NewStudioForm',
  components: {FontForm, ColorForm, DropdownForm},
  props: {
    public: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      draft: '',
      audience: '',
      selectedFont: '',
      selectedColor: '',
      alerts: {}
    }
  },
  methods: {
    changeFont(value) {
      this.selectedFont = value;
    },
    changeColor(value) {
      this.selectedColor = value;
    },
    changeCircle(value) {
      this.audience = value;
    },
    async createFreet() {
      /**
        * Submits a form with the specified options from data().
        */
      if ((!this.draft) || (!this.audience)) {
        const error = 'Error: Content and circle must both be provided.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      try {
        const options = {
          method: 'POST', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({content: this.draft, circle_name: this.audience}),
        };
        const r = await fetch('/api/freets', options);
        const res = await r.json();

        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          throw new Error(res.error);
        }

        const options2 = {
          method: 'POST', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({font: this.selectedFont, color: this.selectedColor}),
        };
        const r2 = await fetch(`/api/studio?freetId=${res.freet._id}`, options2);
        const res2 = await r2.json();
        if (!r2.ok) {
          // If response is not okay, we throw an error and enter the catch block
          throw new Error(res2.error);
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
        this.$emit('closeStudio', res.freet._id);
        this.$emit('close');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
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
  color: #42b983;
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
  padding-bottom: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

textarea {
  margin-left: 2px;
}

button {
  width: 80;
  height: 25px;
  font-family: inherit;
  font-size: 18px;
  border-radius: 5px;
  color: black;
  background-color: #e3d8ed;
  border: 1px solid #e3d8ed;
  box-shadow: 1px 1px 1px 1px gray;
  margin-right: 5px;
}

</style>
