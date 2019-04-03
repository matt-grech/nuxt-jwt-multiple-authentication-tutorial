<template lang="html">
  <div>
    <h1>Supplier Login</h1>
      <form @submit.prevent="login({ user })">
        <fieldset>
          <div>
            <label>Email:</label>
            <input type="text" @input="emailInput($event.target.value)" :value="user.email">
          </div>
          <div>
            <label>Password:</label>
            <input type="password" @input="passwordInput($event.target.value)" :value="user.password">
          </div>
          <div><button type="submit">Login Now</button></div>
          <div v-for="error in errors" v-bind:key="error">{{ error }}</div>
        </fieldset>
      </form>
    </div> 
  </div>
</template>

<script>
export default {
  methods: {
    emailInput(email) {
      this.$store.commit("login/UPDATE_USER_INPUT", { email });
    },
    passwordInput(password) {
      this.$store.commit("login/UPDATE_USER_INPUT", { password });
    },
    login({ user }) {
      this.$store.dispatch("login/loginSupplier", { user });
    },
  },
  computed: {
    user() {
      return this.$store.getters["login/getUser"];
    },
    errors() {
      return this.$store.getters["login/getErrors"];
    },
  }
};
</script>

<style>
div {
  display: block;
}
</style>
