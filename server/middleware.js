const { client } = require('../config/prismic')
const PrismicDOM = require('@prismicio/helpers')

async function middleware (req, res, next) {
  const navigation = await client.getSingle('navigation')
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
