express        = require 'express'
expressWinston = require 'express-winston'
stylus         = require 'stylus'
fs             = require 'fs'
Moonboots      = require 'moonboots'
templatizer    = require 'templatizer'

config         = require './lib/config'
# getconfig must go after config because it uses env
getconfig      = require 'getconfig'
logging        = require './lib/logging'

pages          = require './lib/pages'


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
  # developmentMode: getconfig.isDev
  developmentMode: process.env.NODE_ENV == "development"
  libraries: [
    __dirname + "/clientapp/libraries/zepto.js"
    # ,__dirname + "/clientapp/libraries/backbone-firebase.js"
  ]
  stylesheets: [
    __dirname + "/public/css/lib/bootstrap.css",
    __dirname + "/public/css/app.css",
    __dirname + "/public/css/cardolin.min.css"
  ]
  beforeBuildCSS: (done) ->
    inputFile = __dirname + '/public/css/app.styl'
    outputFile = __dirname + '/public/css/app.css'
    stylus.render fs.readFileSync(inputFile, {encoding: 'utf-8'}), { filename: inputFile }, (err, css) ->
      if err
        console.log 'Error compiling stylus: ', err
      else
        console.log 'Stylus compiled.'
        fs.writeFileSync(outputFile, css)
      done()
  browserify:
    debug: false #process.env.NODE_ENV == "development"
  server: app
  beforeBuild: ->
    templatizer __dirname + "/clienttemplates", __dirname + "/clientapp/templates.js"
)

# use a cookie to send config items to client
clientSettingsMiddleware = (req, res, next) ->
  res.cookie "config", JSON.stringify(getconfig.client)
  next()

# demo server
api = require("./fakeApi.coffee")
app.get '/api/people', api.list
app.get '/api/people/:id', api.get
app.delete '/api/people/:id', api.delete
app.put '/api/people/:id', api.update
app.post '/api/people', api.add

app.get '/pages/:page_name', pages.show
app.post '/create/:user_id/:page_name', pages.save

# Error debug - here we cause an error in the pipeline so we see express-winston in action
#app.get '/error', (req, res, next) ->
#  return next new Error "This is an error and it should be logged to the console"

# configure our main route that will serve our moonboots app
app.get "*", clientSettingsMiddleware, clientApp.html()

# Start server
app.listen process.env.PORT, () ->
  logger.info "Listening at port: #{process.env.PORT}"

###
rune = require './clientapp/libraries/rune/rune.js'
brickCfg =
  type: 'meta'
  content:
    name: 'Chemix'
    tagline: 'I am chemix'
    description: 'lorem ipsum'
    photo: 'http://blog.lafraise.com/fr/wp-content/uploads/2009/10/Chemix.jpg'
rune.renderBrick brickCfg, "cardolin", (err, html) ->
  console.error "chemix: ", err, html
###