<template>
  <v-container class="fill-height text-center" tag="section">
    <v-row no-gutters class="fill-height">
      <v-col cols="12">
        <v-card
          outlined
          class="fill-height"
          tile
        >
          <v-toolbar dense dark color="elevation-0">
           <v-icon class="mr-2">mdi-office-building-outline</v-icon>
           <v-toolbar-title>Expenses</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            dense
            :headers="headers"
            :items="expeses"
            item-key="name"
            class="elevation-1"
            group-by="name"
            show-group-by
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Expenses',
  data: () => ({
    expeses: [
      {
        name: 'Holo Ltd',
        expense: 12,
        reason: 'Travel'
      },
      {
        name: 'Holo Ltd',
        expense: 100,
        reason: 'Meal'
      },
      {
        name: 'Holo Ltd',
        expense: 2500,
        reason: 'Device Allowance'
      },
      {
        name: 'Eat Sleep Code Repeat',
        expense: 100,
        reason: 'Travel'
      }
    ],
    headers: [
      {
        text: 'Client Details',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: 'Expense', value: 'expense' },
      { text: 'Reason', value: 'reason' }
    ]
  })
}
</script>
