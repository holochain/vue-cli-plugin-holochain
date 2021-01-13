<template>
  <v-app>
    <left-drawer />
    <default-view />
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',

  components: {
    LeftDrawer: () => import('./Drawer'),
    DefaultView: () => import('./View')
  }
}
</script>
