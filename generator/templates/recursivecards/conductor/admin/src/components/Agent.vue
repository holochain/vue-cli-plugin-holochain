<template>
  <v-card dark elevation="5" max-width="210">
    <v-img
      class="white--text align-end ma-2"
      max-width="200"
      :src="agent.avatar"
    >
    </v-img>
    <v-card-title>{{ agent.handle }}</v-card-title>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn small icon @click="generateAgentKey({ agent })">
        <v-icon>
          mdi-account-key-outline
        </v-icon>
      </v-btn>
      <v-btn v-if="agent.agentPubKey" small icon @click="installDna({ agent })">
        <v-icon>
          mdi-application-import
        </v-icon>
      </v-btn>
      <v-btn v-if="agent.cellId" small icon :href="`http://localhost:4000${index + 1}?agentPubKey=${encodeURIComponent(agent.agentPubKey)}&cellId=${encodeURIComponent(agent.cellId)}&port=${hcClient.appInterface.port}`" target="_blank">
        <v-icon>
          mdi-application
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-icon @click="$emit('delete-agent', agent)" color="warning">
        mdi-delete-outline</v-icon
      >
      <v-icon @click="openAgentDetail">
        mdi-details
      </v-icon>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Agent',
  props: ['agent', 'index'],
  computed: {
    ...mapState(['hcClient'])
  },
  methods: {
    ...mapActions('admin', ['installDna', 'generateAgentKey']),
    openAgentDetail () {
      this.$emit('open-agent-detail', this.agent)
    }
  }
}
</script>
