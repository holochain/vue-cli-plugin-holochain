import { Config, InstallAgentsHapps } from '@holochain/tryorama'
import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'

const delay = ms => new Promise(r => setTimeout(r, ms))
const recursivecardsDna = path.join(__dirname, '../../../recursivecards.dna.gz')
console.log('recursivecardsDna', recursivecardsDna)

const installation: InstallAgentsHapps = [
  [
    [recursivecardsDna]
  ]
]

const conductorConfig = Config.gen()

module.exports = (orchestrator) => {
  orchestrator.registerScenario('Create a card', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_recursivecards_happ]] = await alice.installAgentsHapps(installation)
    const [alice_recursivecards] = alice_recursivecards_happ.cells
    const card = await alice_recursivecards.call('recursivecards', 'create_card', { parentColumn: '/', name: 'Card 1', preview: '', uuid: uuidv4(), cardType: 'card', order: 0, parent: 'Cards' })
    console.log('card', card)
    t.notEqual(card.entryHash, null)
  })
  orchestrator.registerScenario('Create, then list cards', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_recursivecards_happ]] = await alice.installAgentsHapps(installation)
    const [alice_recursivecards] = alice_recursivecards_happ.cells
    const card1 = await alice_recursivecards.call('recursivecards', 'create_card', { parentColumn: '/', name: 'Card 1', preview: '', uuid: uuidv4(), cardType: 'card', order: 0, parent: 'Cards' });
    const card2 = await alice_recursivecards.call('recursivecards', 'create_card', { parentColumn: '/', name: 'Card 2', preview: '', uuid: uuidv4(), cardType: 'card', order: 0, parent: 'Cards' });
    console.log('card1', card1)
    console.log('card2', card2)
    const cardList = await alice_recursivecards.call('recursivecards', 'list_cards', { parent: 'Cards' });
    console.log('cardList', cardList)
    t.deepEqual(cardList.cards.length, 2)
  })
  orchestrator.registerScenario('Create then delete a card', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_recursivecards_happ]] = await alice.installAgentsHapps(installation)
    const [alice_recursivecards] = alice_recursivecards_happ.cells
    const card = await alice_recursivecards.call('recursivecards', 'create_card', { parentColumn: '/', name: 'Card 1', preview: '', uuid: uuidv4(), cardType: 'card', order: 0, parent: 'Cards' });
    console.log('card', card)
    const deletedClient = await alice_recursivecards.call('recursivecards', 'delete_card', card);
    console.log('deletedClient', deletedClient)
    const cardList = await alice_recursivecards.call('recursivecards', 'list_cards', { parent: 'Cards' });
    console.log('cardList', cardList)
    t.deepEqual(cardList.cards.length, 0)
  })
}
