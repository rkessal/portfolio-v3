const { client } = require('../config/prismic')
const { homeQuery } = require('./queries')

async function homeHandler (req, res) {
  const document = await client.getSingle('home', {
    graphQuery: homeQuery
  })
  res.render('pages/home', {
    document
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
