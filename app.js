const express = require('express')
const path = require('path')
const { app, port } = require('./config/express')
const { homeHandler } = require('./server/handlers')

app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', homeHandler)

app.listen(port, () => {
  console.info(`Server is running on ${port}`)
})

module.exports = app
