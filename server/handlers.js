const { client } = require('../config/prismic')
const { langs } = require('./lang')
const { homeQuery } = require('./queries')

async function homeHandler (req, res) {
  const lang = langs.includes(req.query.lang) ? req.query.lang : 'en-us'
  const document = await client.getSingle('home', {
    graphQuery: homeQuery,
    lang
  })

  const oppositeLang = lang === 'fr-fr' ? 'en-us' : 'fr-fr'

  res.render('pages/home', {
    document,
    oppositeLang
  })
}

async function cdcHandler (req, res) {
  res.render('pages/cdc', {
    document
  })
}

async function privacidadeHandler (req, res) {
  const document = await client.getSingle('privacy_policy')
  res.render('pages/privacidade', {
    document
  })
}

module.exports = {
  homeHandler,
  cdcHandler,
  privacidadeHandler
}
