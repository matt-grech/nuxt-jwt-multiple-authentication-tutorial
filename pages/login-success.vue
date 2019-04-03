<template>
  <div>Hi {{ authenticated.name }}, you are now signed in as {{ authenticated.type }}.</div>
</template>

<script>
export default {
  computed: {
    authenticated() {
      return this.$store.getters["login/getAuthenticated"];
    }
  }
};
</script>
