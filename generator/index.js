// Imports
module.exports = (api, options) => {
  if (!api.hasPlugin('vuetify')) {
    console.log('`@vuetify/presets` requires the `vue-cli-plugin-vuetify` package.')
    return
  }
  try {
    api.render(`./templates/ledger`)
  } catch (e) {
    console.log(e, options)
  }

  api.extendPackage({
    scripts: {
      'postinstall': 'cd dna/ledger/tests && yarn install'
    }
  })

  api.onCreateComplete(() => {
    const presetName = `Holochain Ledger Module`
    const projectName = api.rootOptions.projectName
    api.exitLog(`🍣  Successfully generated ${projectName} from the ${presetName}.\n`)
  })
}
