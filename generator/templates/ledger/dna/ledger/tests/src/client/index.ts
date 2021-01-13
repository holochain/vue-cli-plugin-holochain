import { Config, InstallAgentsHapps } from '@holochain/tryorama'
import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'

const delay = ms => new Promise(r => setTimeout(r, ms))
const ledgerDna = path.join(__dirname, '../../../ledger.dna.gz')

const installation: InstallAgentsHapps = [
  [
    [ledgerDna]
  ]
]

const conductorConfig = Config.gen()

module.exports = (orchestrator) => {
  orchestrator.registerScenario('Create a client', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_ledger_happ]] = await alice.installAgentsHapps(installation)
    const client = await alice_ledger_happ.cells[0].call('ledger', 'create_client', { uuid: uuidv4(), name: 'Test Client 1', country: 'Australia', billingContact: 'Contact', billingAddress: 'Address', path: 'Clients' })
    console.log('client', client)
    t.notEqual(client.entryHash, null)
  })
  orchestrator.registerScenario('Create, then list clients', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_ledger_happ]] = await alice.installAgentsHapps(installation)
    const client1 = await alice_ledger_happ.cells[0].call('ledger', 'create_client', { uuid: uuidv4(), name: 'Test Client 1', country: 'Australia', billingContact: 'Contact', billingAddress: 'Address', path: 'Clients' });
    const client2 = await alice_ledger_happ.cells[0].call('ledger', 'create_client', { uuid: uuidv4(), name: 'Test Client 2', country: 'Australia', billingContact: 'Contact', billingAddress: 'Address', path: 'Clients' });
    console.log('client1', client1)
    console.log('client2', client2)
    const clientList = await alice_ledger_happ.cells[0].call('ledger', 'list_clients', { path: 'Clients' });
    console.log('clientList', clientList)
    t.deepEqual(clientList.clients.length, 2)
  })
  orchestrator.registerScenario('Create then delete a client', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_ledger_happ]] = await alice.installAgentsHapps(installation)
    const client = await alice_ledger_happ.cells[0].call('ledger', 'create_client', { uuid: uuidv4(), name: 'Test Client 1', country: 'Australia', billingContact: 'Contact', billingAddress: 'Address', path: 'Clients' });
    console.log('client', client)
    const deletedClient = await alice_ledger_happ.cells[0].call('ledger', 'delete_client', client);
    console.log('deletedClient', deletedClient)
    const clientList = await alice_ledger_happ.cells[0].call('ledger', 'list_clients', { path: 'Clients' });
    console.log('clientList', clientList)
    t.deepEqual(clientList.clients.length, 0)
  })
}
