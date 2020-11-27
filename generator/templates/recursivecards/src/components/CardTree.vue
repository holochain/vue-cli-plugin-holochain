<template>
  <div>
    <v-treeview
      item-key="key"
      activatable
      open-on-click
      dense
      return-object
      :key="refreshTreeKey"
      :active.sync="active"
      :open.sync="open"
      :items="treeItems"
      :load-children="listColumn"
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon color="primary darken-4"
          v-if="item.cardType === 'column'"
          @contextmenu="show($event, item)"
          @click.stop="
            $emit('column-selected', item);
          "
        >
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon color="primary darken-2"
          v-else
          @click="
            openCard(item);
            $emit('card-selected', item);
          "
        >
          mdi-card-bulleted-outline
        </v-icon>
      </template>
      <template v-slot:label="{ item }">
        <span
          v-if="item.cardType === 'column'"
          @contextmenu="show($event, item)"
          @click.stop="selectColumn(item)"
        >
          {{ item.name }}
        </span>
        <span
          v-else
          @click="
            openCard(item);
            $emit('card-selected', item);
          "
        >
          {{ item.name }}
        </span>
      </template>
    </v-treeview>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      >
        <v-list dense>
        <v-list-item key="menuItem1" @click="clickAction($event, menuItem)">
          <v-list-item-title>Rename Entry Type</v-list-item-title>
        </v-list-item>
        <v-list-item key="menuItem2" @click="clickAction($event, menuItem)">
          <v-list-item-title>Duplicate Entry Type</v-list-item-title>
        </v-list-item>
        </v-list>
      </v-menu>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CardTree',
  components: {},
  data () {
    return {
      refreshTreeKey: 0,
      initiallyOpen: [],
      open: [],
      active: [],
      tree: [],
      contextMenuItem: {},
      files: {
        gitignore: 'mdi-git',
        editorconfig: 'mdi-code-brackets',
        browserslistrc: 'mdi-format-list-checks',
        gz: 'mdi-folder-zip-outline',
        zip: 'mdi-folder-zip-outline',
        rar: 'mdi-folder-zip-outline',
        htm: 'mdi-language-html5',
        html: 'mdi-language-html5',
        'eslintrc.js': 'mdi-language-javascript',
        js: 'mdi-language-javascript',
        ts: 'mdi-language-typescript',
        json: 'mdi-code-json',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        jpg: 'mdi-file-image',
        jpeg: 'mdi-file-image',
        mp4: 'mdi-filmstrip',
        mkv: 'mdi-filmstrip',
        avi: 'mdi-filmstrip',
        wmv: 'mdi-filmstrip',
        mov: 'mdi-filmstrip',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
        other: 'mdi-file-outline',
        nix: 'mdi-nix',
        rs: 'mdi-code-braces',
        md: 'mdi-language-markdown',
        yaml: 'mdi-file-settings-outline',
        toml: 'mdi-file-settings',
        vue: 'mdi-vuetify',
        lock: 'mdi-file-lock-outline',
        LICENSE: 'mdi-license'
      },
      showMenu: false,
      x: 0,
      y: 0,
      menuItems: []
    }
  },
  computed: {
    ...mapState('recursivecards', ['treeItems'])
  },
  methods: {
    ...mapActions('recursivecards', ['openCard', 'getTreeRootColumns']),
    selectColumn (column) {
      this.$emit('column-selected', column)
    },
    async listColumn (item) {
      const parentColumn = `${item.parentColumn}${item.name}/`
      return new Promise(resolve => {
        this.$store.state.db.cards.where({ parentColumn }).toArray(entries => {
          item.children = entries.map(entry => {
            entry.key = `${entry.parentColumn}${entry.name}`
            if (entry.cardType === 'column') {
              entry.children = []
            }
            return entry
          })
          resolve()
        })
      })
    },
    clickAction (event, selectedMenuItem) {
      this.contextMenuItem.name = 'test'
      this.contextMenuItem.edit = true
      console.log(event, selectedMenuItem, this.contextMenuItem)
    },
    show (event, item) {
      event.preventDefault()
      this.showMenu = false
      this.contextMenuItem = item
      this.x = event.clientX
      this.y = event.clientY
      this.$nextTick(() => {
      })
    },
    renameEntry (contextMenuItem) {
      this.contextMenuItem.edit = false
    }
  },
  mounted () {
    this.getTreeRootColumns().then(() => {
      if (this.treeItems.length > 0) {
        this.$emit('column-selected', this.treeItems[0])
      }
    })
  }
}
</script>
