require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  apiUrlClient: 'http://adriana.dev',
  apiUrlServer: 'http://adriana.dev',
  auth: {
    'client_id': '2_swjymfcuxdcs0swg04oscwoc0wsogcco48s0o4ock4g8ko8gk',
    'client_secret': '53n5dcnre2kg88csw8844c4800kksgssw4ckk0sgwokogcc008'
  },
  app: {
    title: 'Adriana',
    description: 'Adriana',
    head: {
      titleTemplate: 'Adriana: %s',
      meta: [
        {name: 'description', content: 'Adriana'},
        {charset: 'utf-8'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  }
}, environment);
