<!-- Default page that also displays freets -->

<template>
  <main class="public">
    <section class="newFreet">
      <section v-if="$store.state.username">
        <NewFreetForm :public="true"/>
      </section>
      <section v-else>
        <header>
          <h2>Welcome to Fritter!</h2>
        </header>
        <article>
          <h3>
            <router-link to="/login">
              Sign in
            </router-link>
            to create, edit, and delete freets.
          </h3>
        </article>
      </section>
    </section>
    <section class="container">
      <header>
        <div class="left">
          <h2>
            Public Feed
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
        class="allPublic"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
          :public="true"
        />
      </section>
      <article
        v-else
      >
        <h3 class="noFreets">No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import NewFreetForm from '@/components/Freet/NewFreetForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, NewFreetForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
  }
};
</script>

<style scoped>

.public {
  display: grid;
  grid-gap: 3%;
  grid-template-columns: 32% 65%;
  margin-top: 3%;
}

.container {
  border-radius: 15px;
  box-shadow: 2px 2px 2px 2px #b29dbf;
  padding: 3%;
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
}

.newFreet {
  position: static;
}

.noFreets {
  margin-left: 5%;
}

section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

button {
    margin-right: 10px;
}

.allPublic {
  flex: 1 0 80vh;
  /* padding: 3%; */
  overflow-y: scroll;
  /* border: 1px solid #111;
  border-radius: 15px; */
  background-color: white;
}
</style>
