express        = require 'express'
expressWinston = require 'express-winston'
cons           = require 'consolidate'
swig           = require 'swig'
Moonboots      = require 'moonboots'
templatizer    = require 'templatizer'
# config         = require 'getconfig'

config         = require './lib/config'
logging        = require './lib/logging'
compile        = require './lib/compile'

routes         = require './routes/index'
pages          = require './routes/pages'


# Init
logger = logging.getLogger "default"
app = express()

# Configuraion
app.configure () ->
  app.engine 'html', cons.swig
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'html'
  app.set 'view options', { layout: false }
  app.use express.favicon 'public/img/favicon.ico'
  app.use express.static __dirname + '/public'
  app.use express.compress()
  app.use express.methodOverride()
  app.use express.bodyParser()
  #app.use expressWinston.logger { transports: logging.getTransports("express.logger"), level: "verbose" }
  app.use app.router
  app.use expressWinston.errorLogger { transports: logging.getTransports("express.errorLogger"), level: "error" }

app.configure 'development', () ->
  app.use express.errorHandler { dumpExceptions: true, showStack: true }

app.configure 'production', () ->
  app.use express.errorHandler()

# Configure Moonboots to serve our client application
clientApp = new Moonboots(
  jsFileName: "onepage"
  cssFileName: "onepage"
  main: __dirname + "/clientapp/app.js"
  # developmentMode: config.isDev
  developmentMode: process.env.NODE_ENV == "development"
  libraries: [__dirname + "/clientapp/libraries/zepto.js"]
  stylesheets: [__dirname + "/public/css/bootstrap.css", __dirname + "/public/css/app.css"]
  browserify:
    debug: false
  server: app
  beforeBuild: ->
    templatizer __dirname + "/clienttemplates", __dirname + "/clientapp/templates.js"
)

# use a cookie to send config items to client
clientSettingsMiddleware = (req, res, next) ->
  res.cookie "config", JSON.stringify(config.client)
  next()

# demo server
api = require("./fakeApi.coffee")
app.get '/api/people', api.list
app.get '/api/people/:id', api.get
app.delete '/api/people/:id', api.delete
app.put '/api/people/:id', api.update
app.post '/api/people', api.add

# Routes
app.get '/', routes.index

app.get '/pages/:page_name', pages.show
app.post '/pages/:page_name/:content', pages.save

# Error debug - here we cause an error in the pipeline so we see express-winston in action
app.get '/error', (req, res, next) ->
  return next new Error "This is an error and it should be logged to the console"

# configure our main route that will serve our moonboots app
app.get "*", clientSettingsMiddleware, clientApp.html()

# Start server
app.listen process.env.PORT, () ->
  logger.info "Listening at port: #{process.env.PORT}"

compile.compileStatic "chemix", {}, (err, html) ->
  console.error "chemix: ", err, html
