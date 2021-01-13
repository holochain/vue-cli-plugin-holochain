import { Orchestrator } from '@holochain/tryorama'

const orchestrator = new Orchestrator()

require('./client')(orchestrator)

orchestrator.run()

