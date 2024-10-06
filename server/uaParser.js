const UAParser = require('ua-parser-js')

async function withUaParser (req, res, next) {
  const ua = UAParser(req.headers['user-agent'])
  res.locals.isPhone = ua.device.type === 'mobile'
  return next()
}

module.exports = {
  withUaParser
}
