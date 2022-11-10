<!-- Default page that also displays freets -->

<template>
  <main>
    <section class="search">
      <GetProfileForm
        ref="getProfileForm"
        value="profileUsername"
        placeholder="🔍 Search for a username"
        button="Find user"
        class="right"
      />
    </section>
    <section class="profile">
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
          <span class="followButton">
            <FollowButton v-if="$store.state.profileUsername && $store.state.username !== $store.state.profileUsername"/>
          </span>
        </div>
      </header>
      <section>
        <div class="general">
          <BioComponent 
            class="bio"
            :bio="$store.state.bio"
          />
          <ProfileFollowersButton 
            class="popupButton"
            value="Following"
            :list="$store.state.following"
          />
          <ProfileFollowersButton 
            class="popupButton"
            value="Followers"
            :list="$store.state.followers"
          />
        </div>
      </section>
      <section
      >
        <div class="freets">
          <h3>
            {{ $store.state.profileFreets ? $store.state.profileFreets.length : 0 }} Public Freets
          </h3>
          <FreetComponent
            v-for="freet in $store.state.profileFreets"
            :key="freet.id"
            :freet="freet"
            :public="true"
          />
      </div>
      </section>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import ProfileFollowersButton from '@/components/Followers/ProfileFollowersButton.vue';
import GetProfileForm from '@/components/Profile/GetProfileForm.vue';
import BioComponent from '@/components/Profile/BioComponent.vue';
import FollowButton from '@/components/Followers/FollowButton.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent, ProfileFollowersButton, GetProfileForm, BioComponent, FollowButton},
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
  margin-left: 10px;
  margin-right: 3%;
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

.freets {
  /* border-top: 1px solid #111; */
  box-shadow: 2px 2px 6px 2px #b29dbf;
  border-radius: 15px;
  flex: 1 0 80vh;
  padding: 3%;
  padding-top: 1%;
  overflow-y: scroll;
}

.search {
  margin: 5%;
  margin-bottom: 1%;
}

.profile {
  /* border: 1px solid #111; */
  border-radius: 2%;
  padding: 1% 3% 3% 3%;
  margin: 5%;
  margin-top: 0;
  box-shadow: 2px 2px 6px 2px #b29dbf;
  border-radius: 15px;
}

.general {
  margin-inline-start: 20px;
  margin-bottom: 10px;
}

.popupButton {
  display: inline;
  padding-right: 1%;
}


</style>
