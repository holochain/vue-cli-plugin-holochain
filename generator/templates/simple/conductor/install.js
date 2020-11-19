const b64 = require('byte-base64')
const hcAWS = require('@holochain/conductor-api').AdminWebsocket
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const rimraf = require('rimraf')

const HOLOCHAIN_ADMIN_PORT = 26970
const HOLOCHAIN_APP_PORT = 15112
let WEB_APP_AGENT_PORT = 40000
rimraf.sync(`${process.cwd()}/agentApps`)
fs.mkdirSync(`${process.cwd()}/agentApps`)

hcAWS.connect(`ws://localhost:${HOLOCHAIN_ADMIN_PORT}`).then(admin => {
  const agents = fs.readdirSync(`${process.cwd()}/agentKeys`, { withFileTypes: true })
  for (const agent of agents) {
    let content = fs.readFileSync(`${process.cwd()}/agentKeys/${agent.name}`)
    const encodedAgentPubKey = agent.name.replace('.md', '')
    const agentPubKey = b64.base64ToBytes(decodeURIComponent(encodedAgentPubKey))
    console.log("agentPubKey", agentPubKey)
    const APP_ID = uuidv4()
    admin.installApp({
      app_id: APP_ID,
      agent_key: agentPubKey,
      dnas: [
        {
          path: '<your path here>/simple/dna/simple.dna.gz',
          nick: 'Simple'
        }
      ]
    }).then(app => {
      const cellId = encodeURIComponent(b64.bytesToBase64(app.cell_data[0][0][0]))
      console.log("b64.bytesToBase64(app.cell_data[0][0][0])", b64.bytesToBase64(app.cell_data[0][0][0]))
      content+= `\n[Web App](http://localhost:${WEB_APP_AGENT_PORT+=1}?agentPubKey=${encodedAgentPubKey}&cellId=${cellId}&port=${HOLOCHAIN_APP_PORT})`
      fs.writeFileSync(`${process.cwd()}/agentApps/${agent.name}`, content)
      admin.activateApp({ app_id: APP_ID }).catch(e => console.log(e))
    }).catch(e => console.log(e))
  }
})
