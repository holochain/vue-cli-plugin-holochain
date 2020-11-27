<template>
  <v-card min-height="400">
    <v-toolbar dense dark tile fixed>
      <v-toolbar-title>
        Demo Agents
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action"
            icon
            v-bind="attrs"
            v-on="on"
            @click="agentDetailsOpen = true"
            small
          >
            <v-icon>mdi-plus-box-outline</v-icon>
          </v-btn>
        </template>
        <span>Add an Agent</span>
      </v-tooltip>
    </v-toolbar>
    <v-row class="pl-2">
      <v-col
        v-for="(agent, index) in agents"
        :key="agent.uuid"
        cols="12"
        sm="4"
        md="3"
        lg="3"
      >
        <agent
          :key="agent.uuid"
          :agent="agent"
          :index="index"
          :details="details"
          @open-agent-detail="openAgentDetail"
          @delete-agent="showDeleteDialog"
        >
        </agent>
      </v-col>
    </v-row>
    <app-confirm-action-dialog
      :isOpen="deleteDialog"
      :message="`delete ${this.actionAgent.handle}`"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    <v-navigation-drawer
      v-model="agentDetailsOpen"
      dark
      absolute
      class="black overflow-visible pa-0"
      right
      width="400"
    >
      <v-card width="100%" height="100%" tile class="pa-0 ma-0">
        <v-system-bar window dark>
          <v-icon>mdi-account-key-outline</v-icon>
          <span>Test Agent Details</span>
          <v-spacer></v-spacer>
          <v-icon v-if="!isEditing" @click="isEditing = true"
            >mdi-square-edit-outline</v-icon
          >
          <v-icon v-if="isEditing" @click="cancel">mdi-cancel</v-icon>
          <v-icon v-if="isEditing" @click="save">mdi-content-save</v-icon>
        </v-system-bar>
        <v-row no-gutters justify="center">
          <v-col>
            <v-form>
              <v-toolbar dark dense outlined rounded>
                <v-toolbar-title v-if="!isEditing">
                  {{ actionAgent.handle }}
                </v-toolbar-title>
                <v-toolbar-title v-if="isEditing">
                  <v-text-field
                    dense
                    dark
                    outlined
                    class="title mt-6 pt-0 pl-n2"
                    v-model="actionAgent.handle"
                    label="Handle, eg @philt3r"
                  />
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-img
                v-if="!isEditing"
                height="300"
                contain
                :src="actionAgent.avatar"
              >
              </v-img>
              <v-image-input
                :key="actionAgent.uuid"
                v-if="isEditing"
                v-model="actionAgent.avatar"
                :image-quality="1"
                clearable
                image-format="jpeg,png"
                :image-width="100"
                :image-height="100"
                dark
                image-min-scaling="contain"
                class="ml-15 pl-10 mt-5 mb-n3"
              />
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import { mapState, mapActions } from 'vuex'
import VImageInput from 'vuetify-image-input/a-la-carte'
export default {
  name: 'TestAgents',
  components: {
    Agent: () => import('@/components/Agent.vue'),
    VImageInput
  },
  data () {
    return {
      details: false,
      isEditing: true,
      agentDetailsOpen: false,
      actionAgent: {
        uuid: uuidv4(),
        handle: '',
        avatar: ''
      },
      action: 'create',
      deleteDialog: false
    }
  },
  methods: {
    ...mapActions('admin', ['fetchAgents', 'saveAgent', 'deleteAgent']),
    openAgentDetail (agent) {
      this.isEditing = false
      this.action = 'update'
      this.actionAgent = { ...agent }
      this.agentDetailsOpen = true
    },
    save () {
      this.saveAgent({
        action: this.action,
        conductor: this.conductor,
        agent: this.actionAgent
      }).then(() => this.reset())
    },
    cancel () {
      this.reset()
    },
    reset () {
      this.actionAgent = {
        uuid: uuidv4(),
        handle: '',
        avatar: ''
      }
      this.agentDetailsOpen = false
      this.isEditing = true
    },
    peopleSelected (people) {
      this.actionAgent.people = people
    },
    showDeleteDialog (agent) {
      this.actionAgent = agent
      this.deleteDialog = true
    },
    confirmDelete () {
      this.deleteAgent(this.actionAgent).then(() => this.reset())
      this.deleteDialog = false
    },
    cancelDelete () {
      this.deleteDialog = false
    }
  },
  computed: {
    ...mapState('admin', ['conductor', 'agents'])
  },
  mounted () {
    this.fetchAgents(this.conductor)
  }
}
</script>
