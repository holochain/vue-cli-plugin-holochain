<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    app
    clipped
    fixed
    dark
    class="overflow-auto"
    left
    width="200"
    :mini-variant.sync="mini"
    permanent
  >
    <slot>
      <router-view name="navDrawer" @change-mini="mini = !mini"></router-view>
    </slot>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AppDrawer',
  data () {
    return {
      drawerOpen: true,
      mini: false
    }
  }
}
</script>
