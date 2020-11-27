<template>
  <v-card class="mx-auto pa-1" width="290">
    <v-img
      :src="card.preview"
      width="286px">
    </v-img>
    <v-card-title>{{card.name}}</v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'Card',
  props: ['card']
}
</script>
