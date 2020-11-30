<template>
  <section id="cards">
    <v-row no-gutters height="100%">
      <v-col>
        <split
          :key="cwHeight"
          :style="`height: ${cwHeight}px; width: 100%;`"
          :gutterSize="2"
        >
          <split-area :size="22">
            <v-toolbar dense dark>
              <v-toolbar-title>Columns & Cards</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon @click="addRootColumn" color="primary" dark>
                mdi-table-column-plus-before
              </v-icon>
              <v-icon @click="addColumn" color="primary" dark>
                mdi-table-column-plus-after
              </v-icon>
            </v-toolbar>
            <card-tree
              key="cardTree"
              @column-selected="columnSelected"
              @card-selected="cardSelected"
              :height="cwHeight"
            />
          </split-area>
          <split-area :size="78">
            <v-sheet
              class="mx-auto fill-height"
              elevation="8"
            >
              <column v-if="selectedColumn !== undefined" :column="selectedColumn" :key="`${selectedColumn.uuid}`" :isSelected="true" @edit-column="editColumn">
                <v-slide-group
                  v-model="model"
                  class="pa-2 fill-height"
                  show-arrows
                >
                  <v-slide-item
                    v-for="column in columns"
                    :key="column.uuid"
                  >
                    <div class="pa-1">
                      <column :column="column" :key="`${column.uuid}`" @edit-column="editColumn">
                      </column>
                    </div>
                  </v-slide-item>
                </v-slide-group>
              </column>
            </v-sheet>
          </split-area>
        </split>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-model="columnDrawerOpen"
      fixed
      dark
      class="overflow-visible pa-0"
      right
      :width="this.$vuetify.breakpoint.lgAndUp ? 1000 : 800"
    >
      <template v-slot:prepend>
        <v-system-bar
          window
          dark
        >
          <v-icon>mdi-message</v-icon>
          <span>10 unread messages</span>
          <v-spacer></v-spacer>
          <v-icon @click="columnDrawerOpen = false">mdi-close</v-icon>
        </v-system-bar>
      </template>
      <v-card class="fill-height">
        <v-card-title>
          <span class="headline">Column Details</span>
          <v-spacer></v-spacer>
          Parent --> {{ parentColumnName }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field
                  v-model="editingColumn.name"
                  label="Name"
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
            @click="closeCol"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary darken-1"
            text
            @click="saveCol"
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
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Cards',
  components: {
    Column: () => import('@/components/Column.vue'),
    CardTree: () => import('@/components/CardTree.vue')
  },
  data: () => ({
    model: null,
    columnDrawerOpen: false,
    cwHeight: 700,
    selectedTreeItem: {},
    parentColumnName: '',
    editingColumn: {
      uuid: uuidv4(),
      name: '',
      parentColumn: '/',
      children: [],
      cardType: 'column',
      order: 0
    },
    action: 'create',
    select: [],
    items: [
      'Profile',
      'Idea',
      'Music Player',
      'Video Player',
      'Tags'
    ]
  }),
  computed: {
    ...mapState('recursivecards', ['treeItems', 'selectedColumn', 'columns'])
  },
  methods: {
    ...mapActions('recursivecards', ['saveColumn', 'setSelectedColumn', 'saveCard']),
    addRootColumn () {
      this.editingColumn.parentColumn = '/'
      this.parentColumnName = 'Root'
      this.columnDrawerOpen = true
    },
    addColumn () {
      if (this.selectedColumn.parentColumn) {
        this.editingColumn.parentColumn = `${this.selectedColumn.parentColumn}${this.selectedColumn.uuid}/`
      }
      this.parentColumnName = this.selectedColumn.name
      this.columnDrawerOpen = true
    },
    editColumn (column) {
      console.log('🚀 editColumn ~ column', column)
      this.parentColumnName = column.parentColumn
      this.editingColumn = { ...column }
      this.action = 'update'
      this.columnDrawerOpen = true
    },
    setCodeWindowHeight () {
      this.cwHeight = this.$el.clientHeight
    },
    columnSelected (column) {
      this.selectedTreeItem = column
      this.setSelectedColumn(column)
    },
    cardSelected (card) {
      // this.setSelectedColumn(card)
    },
    deleteItem (item) {
      this.editingColumn = Object.assign({}, item)
      this.deleteColumnDialog = true
    },
    deleteItemConfirm () {
      this.deleteFlavour({ flavour: this.selectedColumn })
      this.closeDelete()
    },
    closeCol () {
      this.columnDrawerOpen = false
      this.$nextTick(() => {
        this.editingColumn = {
          uuid: uuidv4(),
          name: '',
          parentColumn: '/',
          children: [],
          cardType: 'column',
          order: 0
        }
        this.action = 'create'
      })
    },
    saveCol () {
      if (this.editingColumn.order === undefined) {
        this.editingColumn.order = this.selectedColumn.children.length + 1
      }
      this.saveColumn({ column: this.editingColumn, action: this.action })
      if (this.action === 'create') {
        if (this.selectedTreeItem.children) {
          this.selectedTreeItem.children.push(this.editingColumn)
        } else {
          this.treeItems.push(this.editingColumn)
        }
      } else {
        if (this.selectedTreeItem.children) {
          this.selectedTreeItem.children = this.selectedTreeItem.children.map(column =>
            column.uuid !== this.editingColumn.uuid ? column : { ...column, ...this.editingColumn }
          )
        } else {
          this.treeItems = this.treeItems.map(column =>
            column.uuid !== this.editingColumn.uuid ? column : { ...column, ...this.editingColumn }
          )
        }
      }
      this.closeCol()
    }
  },
  mounted () {
    this.setCodeWindowHeight()
  }
}
</script>
