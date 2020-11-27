<template>
  <v-app>
    <default-view/>
  </v-app>
</template>

<script>
export default {
  name: 'BasicLayout',

  components: {
    DefaultView: () => import('./View')
  }
}
</script>
