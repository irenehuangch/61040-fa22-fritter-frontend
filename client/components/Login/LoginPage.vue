<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section class="login">
      <section>
        <header>
          <h2>Have an account?</h2>
        </header>
        <LoginForm />
      </section>
      <section>
        <header>
          <h2>New to Fritter?</h2>
        </header>
        <RegisterForm />
      </section>
    </section>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterForm,
    LoginForm
  }
};
</script>

<style scoped>
.login {
  display: grid;
  grid-gap: 4%;
  grid-template-columns: 48% 48%;
  margin-top: 3%;
}

</style>