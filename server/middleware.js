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

  console.dir(navigation, { depth: null })

  res.locals = {
    ...res.locals,
    // preloader,
    // meta,
    linkResolver,
    navigation,
    footer,
    // whatsapp,
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
