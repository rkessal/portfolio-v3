const { client } = require('../config/prismic')
const PrismicDOM = require('@prismicio/helpers')
const { langs } = require('./lang')

async function middleware (req, res, next) {
  const lang = langs.includes(req.query.lang) ? req.query.lang : 'en-us'
  const navigation = await client.getSingle('navigation', { lang })
  const footer = await client.getSingle('footer', {
    graphQuery: `{
      footer {
        ...footerFields
        navigation {
          logo
          body
        }
      }
    }`,
    lang
  })

  res.locals = {
    ...res.locals,
    linkResolver,
    navigation,
    footer,
    PrismicDOM
  }

  return next()
}

const linkResolver = (document) => {
  return '/' + document.url
}

module.exports = {
  middleware
}
