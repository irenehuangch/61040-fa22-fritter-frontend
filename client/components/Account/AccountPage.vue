<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <LogoutForm class="small"/>
    </section>
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <div class="settings">
        <ChangeUsernameForm class="item"/>
        <ChangePasswordForm class="item"/>
        <ChangeNameForm class="item"/>
        <DeleteAccountForm class="small"/>
      </div>
      <!-- <DeleteAccountForm class="small"/> -->
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import ChangeNameForm from '@/components/Account/ChangeNameForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    ChangeNameForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>

<style scoped>
section {
  margin: 5%;
}

.settings {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}

.item {
  margin-right: 30px;
}


.small {
  width: 25%;
}

</style>