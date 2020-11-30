// Imports
const fs = require('fs')

module.exports = (api, options) => {
  if (!api.hasPlugin('vuetify')) {
    console.log('`@vuetify/presets` requires the `vue-cli-plugin-vuetify` package.')

    return
  }
  const configuration = options.configuration
  try {
    api.render(`./templates/${configuration}`)
  } catch (e) {
    console.log(e, options)
  }
  const files = { './src/App.vue': `../generator/templates/${configuration}/src/App.vue` }
  try {
    api.render(files)
  } catch (e) {
    console.log(e, options)
  }

  api.extendPackage({
    dependencies: {
      '@holochain/conductor-api': '^0.0.1-dev.11',
      'byte-base64': '^1.1.0',
      'dexie': '^3.0.3-rc.4',
      'vuedraggable': '^2.24.3',
      'vuetify-image-input': '^19.1.0',
      'vue-split-panel': '^1.0.4',
      '@mdi/font': '^5.8.55'
    },
    devDependencies: {
      'rimraf': '^3.0.2',
      'foreman': '^3.0.1',
      'eslint-config-vuetify': '^0.6.1',
      'eslint-plugin-vue': '^6.2.2',
      'eslint-plugin-vuetify': '^1.0.0-beta.6',
      lodash: '^4.17.15',
      webfontloader: '^1.6.28'
    },
    scripts: {
      'serve:40001': 'vue-cli-service serve --port 40001',
      'serve:40002': 'vue-cli-service serve --port 40002',
      'serve:40003': 'vue-cli-service serve --port 40003',
      'serve:40004': 'vue-cli-service serve --port 40004',
      'serve:admin': 'cd ./conductor/admin && yarn serve',
      'start': 'nf start'
    }
  })

  api.injectImports(api.entryFile, 'import \'./plugins\'')

  api.onCreateComplete(() => {
    const presetName = `Holochain ${configuration} preset`
    const projectName = api.rootOptions.projectName

    const home = api.resolve('src/views/Home.vue')
    if (fs.existsSync(home)) fs.unlinkSync(home)
    const about = api.resolve('src/views/About.vue')
    if (fs.existsSync(about)) fs.unlinkSync(about)

    api.exitLog(`🍣  Successfully generated ${projectName} from the ${presetName}.\n`)
    api.exitLog(`Make sure you have holochain installed.`)
    api.exitLog(`Install the Conductor Admin and Tests node modules`)
    api.exitLog(`yarn install:all`)
    api.exitLog(`Then run all the bits`)
    api.exitLog(`yarn start`)
  })
}
