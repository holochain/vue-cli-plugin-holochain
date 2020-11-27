<template>
  <v-dialog v-model="isOpen" width="500" persistent>
    <v-card>
      <v-alert type="warning">
        Just checking you want to {{ message }}?
      </v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="warning" text @click="confirm">
          Yes
        </v-btn>
        <v-btn color="warning" text @click="cancel">
          No
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmActionDialog',
  props: ['isOpen', 'message'],
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
