const express = require('express')
const path = require('path')
const { app, port } = require('./config/express')
const { homeHandler, cdcHandler, privacidadeHandler } = require('./server/handlers')
const { middleware } = require('./server/middleware')
const { withUaParser } = require('./server/uaParser')

app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(withUaParser)
app.use(middleware)

app.get('/', homeHandler)
app.get('/cdc', cdcHandler)
app.get('/privacidade', privacidadeHandler)

app.listen(port, () => {
  console.info(`Server is running on ${port}`)
})

module.exports = app
