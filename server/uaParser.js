const UAParser = require('ua-parser-js')

async function withUaParser (req, res, next) {
  const ua = UAParser(req.headers['user-agent'])
  res.locals.device = ua.device.type
  return next()
}

module.exports = {
  withUaParser
}
