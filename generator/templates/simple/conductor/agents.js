const b64 = require('byte-base64')
const hcAWS = require('@holochain/conductor-api').AdminWebsocket
const fs = require('fs')
const rimraf = require('rimraf')
const HOLOCHAIN_ADMIN_PORT = 26970
const HOLOCHAIN_APP_PORT = 15112

rimraf.sync(`${process.cwd()}/agentKeys`)
fs.mkdirSync(`${process.cwd()}/agentKeys`)

hcAWS.connect(`ws://localhost:${HOLOCHAIN_ADMIN_PORT}`).then(admin => {
    const agents = fs.readdirSync(`${process.cwd()}/agentAvatars`, { withFileTypes: true })
    for (const agent of agents) {
        admin.generateAgentPubKey().then(agentPubKey => {
            let content = `![${agent.name}](../agentAvatars/${agent.name})`
            fs.writeFileSync(`${process.cwd()}/agentKeys/${encodeURIComponent(b64.bytesToBase64(agentPubKey))}.md`, content)
        })
    }
    admin.attachAppInterface({ port: HOLOCHAIN_APP_PORT }).then(appInterface => {
        fs.writeFileSync(`${process.cwd()}/appInterface.md`, `${appInterface.port}`)
    })
    .catch(e => console.log(e))
})