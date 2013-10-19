express        = require 'express'
expressWinston = require 'express-winston'

config         = require './lib/config'
logging        = require './lib/logging'

routes         = require './routes/'

# Init
logger = logging.getLogger "default"
app = express()

# Configuraion
app.configure () ->
  app.use express.favicon 'public/img/favicon.ico'
  app.use express.static __dirname + '/public'
  app.use express.compress()
  app.use express.methodOverride()
  app.use express.bodyParser()
  app.use expressWinston.logger { transports: logging.getTransports("express.logger"), level: "verbose" }
  app.use app.router
  app.use expressWinston.errorLogger { transports: logging.getTransports("express.errorLogger"), level: "error" }

app.configure 'development', () ->
  app.use express.errorHandler { dumpExceptions: true, showStack: true }

app.configure 'production', () ->
  app.use express.errorHandler()

# Routes
app.get '/', routes.index

# Error debug - here we cause an error in the pipeline so we see express-winston in action
app.get '/error', (req, res, next) ->
  return next new Error "This is an error and it should be logged to the console"

# redirect all others to the index (HTML5 history)
app.get '*', routes.index

# Start server
app.listen process.env.PORT, () ->
  logger.info "Listening at port: #{process.env.PORT}"