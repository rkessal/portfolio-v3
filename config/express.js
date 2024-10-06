const express = require('express')

const app = express()
const port = 3000

app.set('view engine', 'pug')
app.set('port', port)

module.exports = {
  app,
  port
}
