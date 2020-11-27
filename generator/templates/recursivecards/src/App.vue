<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$vuetify.theme.dark = true
    if (localStorage.getItem('agentPubKey')) {
      this.holo = false
      this.$store.dispatch('initialiseStore')
        .then(() => this.$store.dispatch('recursivecards/initialise'))
        .then(() => this.$store.dispatch('recursivecards/fetchCards'))
    }
  }
}
</script>
