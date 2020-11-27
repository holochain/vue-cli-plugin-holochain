module.exports = [
  {
    type: 'list',
    name: 'configuration',
    message: 'Select from one of the following presets to scaffold your Vuetify project:',
    choices: [
      {
        name: 'Holochain Simple (A simple Holochain-Vuetify project)',
        value: 'simple'
      },
      {
        name: 'Holochain Recursive Cards (Base for Kanban style apps)',
        value: 'recursivecards'
      }
    ],
    default: 'simple'
  }
]
