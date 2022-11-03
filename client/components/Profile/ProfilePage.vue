<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <header>
        <div class="left">
        <h2>
          {{ $store.state.name }}
        </h2>
        <span v-if="$store.state.profileUsername">
            @{{ $store.state.profileUsername }}
          </span>
          <span v-else>
            @{{ $store.state.username }}
          </span>
        </div>
        <div class="right">
          <GetProfileForm
            ref="getProfileForm"
            value="profileUsername"
            placeholder="🔍 Search for a username (optional)"
            button="🔄 Get profile"
          />
        </div>
      </header>
      <section>
        <div>
          <ProfileFollowersButton 
            value="Following"
            :list="$store.state.following"
          />
          <ProfileFollowersButton 
            value="Followers"
            :list="$store.state.followers"
          />
        </div>
        <div>
          <BioComponent :bio="$store.state.bio" />
        </div>
      </section>
      <section
      >
        <div>
          {{ $store.state.profileFreets ? $store.state.profileFreets.length : 0 }} Public Freets
        </div>
        <div>
          <FreetComponent
            v-for="freet in $store.state.profileFreets"
            :key="freet.id"
            :freet="freet"
          />
      </div>
      </section>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import ProfileFollowersButton from '@/components/Profile/ProfileFollowersButton.vue';
import GetProfileForm from '@/components/Profile/GetProfileForm.vue';
import BioComponent from '@/components/Profile/BioComponent.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent, ProfileFollowersButton, GetProfileForm, BioComponent},
  mounted() {
    // this.$store.commit('refreshProfile');
    this.$refs.getProfileForm.submit();
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

h2 {
  padding-right: 5%;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
