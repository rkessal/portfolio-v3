require('dotenv').config()
const fetch = require('node-fetch')
const prismic = require('@prismicio/client')

const repoName = process.env.PRISMIC_REPO_NAME
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

const client = prismic.createClient(repoName, {
  fetch,
  accessToken
})

module.exports = {
  client
}
