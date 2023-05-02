'use strict'

const logger = require('morgan')
const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const fileParser = require('express-multipart-file-parser')

global.XMLHttpRequest = require('xhr2')

app.use(cors())
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const checkPublicUrls = request => {
  return (
    request.path.includes('/v1/authenticate') ||
    request.path.includes('/v1/events') ||
    request.path.includes('/v1/token') ||
    request.path.includes('/v1/healthcheck')
  )
}

app.use(async (request, response, next) => {
  if (checkPublicUrls(request)) {
    next()
    return
  }

  const token = request.headers['authorization']

  if (!token) {
    response.status(401).json({ status: '401', message: 'Unauthorized', data: {} })
    return
  }

  try {
    next()
  } catch (error) {
    response.status(500).json({ status: '500', message: 'Error while verifying token', data: {} })
  }
})

app.use(bodyParser.json({ limit: '100mb' })) // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    limit: '100mb',
    extended: true,
  })
)

app.use(
  logger(
    ':date[iso] - :remote-addr ":method :url HTTP/:http-version" status::status :res[' +
      'content-length] bytes - :response-time \bms'
  )
)

app.use(fileParser)
app.use('/v1/', require('./controllers/v1'))

module.exports = app
