<template>
  <section id="column">
    <v-card min-width='300' :color="isSelected ? 'grey darken-3' : 'grey lighten-1'">
      <v-toolbar dense dark>
        <v-toolbar-title>
          {{column.name}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon small color="primary" @click="$emit('edit-column', column)">
          <v-icon>mdi-folder-edit-outline</v-icon>
        </v-btn>
        <v-btn icon small color="primary" @click="addCard">
          <v-icon>mdi-card-plus-outline</v-icon>
        </v-btn>
      </v-toolbar>
      <v-row
        no-gutters
        class="fill-height"
        align="start"
        justify="start">
        <v-col :cols="12 - colsSlot">
        <draggable
          :key="`draggable${column.uuid}`"
          v-model="cards"
          :animation="200"
          ghost-class="ghost"
          group="kanban-column"
          width="100%"
          :class="isSelected ? 'column-selected pa-0' : 'column pa-0'"
          style="overflow: auto;"
          @change="change"
        >
          <v-col v-for="card in cards" :key="`${card.uuid}`">
            <card :card="card" @edit-card="editCard"/>
          </v-col>
        </draggable>
        </v-col>
        <v-col :cols="colsSlot">
          <slot></slot>
        </v-col>
      </v-row>
    </v-card>
    <v-navigation-drawer
      v-model="cardDrawerOpen"
      fixed
      dark
      hide-overlay
      class="overflow-visible pa-0"
      right
      :width="this.$vuetify.breakpoint.lgAndUp ? 400 : 300"
    >
      <template v-slot:prepend>
        <v-system-bar window dark>
          <v-icon>mdi-message</v-icon>
          <span>10 unread messages</span>
          <v-spacer></v-spacer>
          <v-icon @click="cardDrawerOpen = false">mdi-close</v-icon>
        </v-system-bar>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Card Details</span>
          <v-spacer></v-spacer>
          Add to --> {{ column.name }}
        </v-card-title>
        <v-row no-gutters>
          <v-col cols="12" class="pr-2 pl-2">
            <v-text-field
              v-model="editingCard.name"
              label="Name"
              dark
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pr-2">
              <v-image-input
                v-model="editingCard.preview"
                :image-quality="1"
                clearable
                image-format="jpeg,png"
                :image-width="100"
                :image-height="100"
                dark
                image-min-scaling="contain"
                class="ml-15 pl-10 mt-5 mb-n3"
              />
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"
            text
            @click="closeCd"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary darken-1"
            text
            @click="saveCd"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
  </section>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
import VImageInput from 'vuetify-image-input/a-la-carte'
export default {
  name: 'Column',
  components: {
    draggable,
    VImageInput,
    Card: () => import('@/components/Card.vue')
  },
  props: ['column', 'isSelected'],
  data () {
    return {
      isLoading: true,
      cardDrawerOpen: false,
      action: 'create',
      cards: [],
      editingCard: {
        uuid: uuidv4(),
        name: '',
        preview: '',
        parentColumn: '/',
        cardType: 'card'
      },
      defaultCard: {
        uuid: uuidv4(),
        name: '',
        preview: '',
        parentColumn: '/',
        cardType: 'card'
      }
    }
  },
  computed: {
    colsSlot () {
      if (this.isSelected && this.cards.length > 0) return 9
      return 12
    }
  },
  methods: {
    ...mapActions('recursivecards', ['saveCard']),
    change () {
      const reorderedCards = this.cards.map((card, index) => ({
        ...card,
        order: index
      }))
      reorderedCards.forEach(card => {
        card.parentColumn = `${this.column.parentColumn}${this.column.uuid}/`
        this.saveCard({ card, action: 'update' })
      })
      console.log(reorderedCards)
    },
    addCard () {
      this.editingCard.parentColumn = `${this.column.parentColumn}${this.column.uuid}/`
      this.cardDrawerOpen = true
    },
    editCard (card) {
      this.editingCard = { ...card }
      this.action = 'update'
      this.cardDrawerOpen = true
    },
    closeCd () {
      this.cardDrawerOpen = false
      this.$nextTick(() => {
        this.editingCard = Object.assign({}, this.defaultCard)
        this.action = 'create'
      })
    },
    saveCd () {
      if (this.editingCard.order === undefined) this.editingCard.order = this.cards.length
      this.saveCard({ card: this.editingCard, action: this.action })
      if (this.action === 'create') {
        this.cards.push(this.editingCard)
      } else {
        this.cards = this.cards.map(card =>
          card.uuid !== this.editingCard.uuid ? card : { ...card, ...this.editingCard }
        )
      }
      this.closeCd()
    }
  },
  mounted () {
    this.isLoading = true
    const parentColumn = `${this.column.parentColumn}${this.column.uuid}/`
    this.$store.state.db.cards.where({ parentColumn }).toArray(entries => {
      const internalCards = entries.filter(entry => entry.cardType === 'card')
      if (internalCards !== undefined) {
        this.cards = internalCards
      }
      this.isloading = false
    })
  }
}
</script>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.column-selected {
  box-sizing: border-box;
  overflow-y: auto;
  height: calc(100vh - 50px);
}
.column {
  box-sizing: border-box;
  overflow-y: auto;
  height: calc(100vh - 115px);
}
</style>
