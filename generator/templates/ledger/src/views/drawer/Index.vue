<template>
<v-card
    class="mx-auto fill-height"
    max-width="300"
    tile
  >
   <v-toolbar dense dark color='elevation-0'>
    <v-toolbar-title @click="$emit('change-mini'); mini = ! mini">📒  Ledger</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-icon v-if="!mini" @click="settingsDialog = true">mdi-account-cog-outline</v-icon>
   </v-toolbar>
    <v-list dense>
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
      >
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-dialog
      v-model="settingsDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Consultant Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="profile.billingEntity"
                  label="Billing Entity*"
                  hint="Who's getting paid 💰"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
                <v-textarea
                  v-model="profile.billingEntityAddress"
                  label="Billing Entity Address*"
                  hint="What's your address"
                  rows="3"
                  persistent-hint
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="profile.financialInstitution"
                  label="Financial Institution"
                  hint="eg: Transferwise"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="profile.bsb"
                  label="BSB*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="profile.acct"
                  label="Account Number*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="profile.acctHolder"
                  label="Account Holder*"
                  hint="eg: Your name"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pa-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="settingsDialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveConsultantProfile(profile); settingsDialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Drawer',
  data: () => ({
    selectedItem: 0,
    mini: false,
    items: [
      { text: 'Invoices', icon: '🧾', to: 'invoices', btn: 'New Invoice' },
      { text: 'Expenses', icon: 'mdi-account-cash-outline', to: 'expenses', btn: 'New Expense' },
      { text: 'Clients', icon: 'mdi-office-building-outline', to: 'clients', btn: 'New Client' },
      { text: 'Contacts', icon: 'mdi-account-group-outline', to: 'contacts', btn: 'New Contact' }
    ],
    settingsDialog: false,
    profile: {}
  }),
  methods: {
    ...mapActions('ledger', ['saveConsultantProfile'])
  },
  computed: {
    ...mapState('ledger', ['consultantProfile'])
  },
  created () {
    this.profile = { ...this.consultantProfile }
  }
}
</script>
