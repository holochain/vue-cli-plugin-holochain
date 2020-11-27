import { Orchestrator } from '@holochain/tryorama'

const orchestrator = new Orchestrator()

require('./card')(orchestrator)

orchestrator.run()
