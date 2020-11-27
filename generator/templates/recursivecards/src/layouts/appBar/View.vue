<template>
  <v-main>
    <v-fade-transition mode="out-in">
      <router-view id="router"/>
    </v-fade-transition>
  </v-main>
</template>

<script>
export default {
  name: 'AppView'
}
</script>
<style scoped>
#router {
  height: 100% !important;
}
</style>
