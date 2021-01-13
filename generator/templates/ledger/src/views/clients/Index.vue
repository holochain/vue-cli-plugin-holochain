<template>
  <v-container class="fill-height text-center" tag="section">
    <v-row no-gutters class="fill-height">
      <v-col cols="12">
        <v-card
          outlined
          class="fill-height"
          tile
        >
          <v-data-table
            dense
            :headers="headers"
            :items="clients"
            item-key="name"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar dense dark color="elevation-0">
               <v-icon class="mr-2">mdi-office-building-outline</v-icon>
               <v-toolbar-title>Clients</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog
                  v-model="clientDialog"
                  max-width="500px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-account-plus-outline
                    </v-icon>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Client Details</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Client name"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.country"
                              label="Country"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.billingContact"
                              label="Billing Contact"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.billingAddress"
                              label="Billing Address"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary darken-1"
                        text
                        @click="close"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary darken-1"
                        text
                        @click="save"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="deleteDialog" max-width="600px">
                  <v-card>
                    <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-lead-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Clients',
  data: () => ({
    clientDialog: false,
    deleteDialog: false,
    headers: [
      {
        text: 'Client Details',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: 'Country', value: 'country' },
      { text: 'Billing Contact', value: 'billingContact' },
      { text: 'Billing Address', value: 'billingAddress' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedItem: {
      uuid: uuidv4(),
      name: '',
      country: '',
      billingContact: '',
      billingAddress: ''
    },
    defaultItem: {
      uuid: uuidv4(),
      name: '',
      country: '',
      billingContact: '',
      billingAddress: ''
    },
    action: 'create'
  }),
  computed: {
    ...mapState('ledger', ['clients'])
  },
  methods: {
    ...mapActions('ledger', ['saveClient', 'deleteClient']),
    editItem (item) {
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.action = 'update'
      this.clientDialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.deleteDialog = true
    },
    deleteItemConfirm () {
      this.deleteClient({ client: this.editedItem })
      this.closeDelete()
    },
    close () {
      this.clientDialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.action = 'create'
      })
    },
    closeDelete () {
      this.deleteDialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      this.saveClient({ client: this.editedItem, action: this.action })
      this.close()
    }
  }
}
</script>
