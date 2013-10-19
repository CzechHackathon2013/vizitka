logger         = require('../lib/logging').getLogger "default"
memjs			     = require('memjs')
Firebase       = require('firebase')

config         = require '../lib/config'
compile         = require '../lib/compile'

firebase_url = 'https://min-vizitka.firebaseIO.com/pages/'
client = new memjs.Client.create()
firebase = new Firebase(firebase_url)

firebase.on 'value', (snapshot) ->
  console.log 'loaded data from firebase', snapshot.val()

exports.show = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  cache_key = req.params.page_name
  client.get cache_key, (error, result) ->
    if !result
      firebase_record = new Firebase(firebase_url+cache_key)
      firebase_record.on 'value', (data) ->
        compile.compileStatic_old cache_key, data.val(), (error, content) ->
          client.set cache_key, content
          res.send content.toString()
    else
      res.send result.toString()

exports.save = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  firebase.child(req.params.page_name).set {key: req.params.page_name, content: req.params.content, owner: 1234}, (error) ->
    console.log "pushed" unless error
    res.send {error: error}