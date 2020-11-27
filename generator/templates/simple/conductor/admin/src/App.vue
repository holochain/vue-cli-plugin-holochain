<template>
  <v-fade-transition mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$vuetify.theme.dark = true
    this.$store.dispatch('initialiseStore')
  }
}
</script>
