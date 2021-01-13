<template>
  <v-container class="fill-height" tag="section">
<v-row no-gutters class="fill-height">
      <v-col cols="6" class="pr-3">
        <v-card
          outlined
          class="fill-height"
          tile
        >
          <v-toolbar dense dark color='elevation-0'>
           <v-toolbar-title>📥 In Progress</v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="3" class="pr-3">
        <v-card
          outlined
          class="fill-height"
          tile
        >
          <v-toolbar dense dark color="elevation-0">
           <v-toolbar-title>📮 Sent</v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card
          outlined
          class="fill-height"
          tile
        >
          <v-toolbar dense dark color='elevation-0'>
           <v-toolbar-title>😎 Paid</v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Invoices',
  created () {
    if (localStorage.getItem('agentPubKey')) {
      this.holo = false
      this.$store.dispatch('ledger/initialise').then(this.$store.dispatch('ledger/fetchClients'))
    }
  }
}
</script>
