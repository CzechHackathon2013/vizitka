logger         = require('../lib/logging').getLogger "default"
memjs			     = require('memjs')
#crypto				 = require('crypto')
Firebase       = require('firebase')

config         = require '../lib/config'
compile         = require '../lib/compile'

client = new memjs.Client.create()
firebase = new Firebase('https://min-vizitka.firebaseIO-demo.com/')

firebase.on 'value', (snapshot) ->
  console.log 'data updated over firebase', snapshot.val()

exports.show = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
#  key_hash = crypto.createHash('sha1')
  cache_key = req.params.page_name
#  cache_key = key_hash.update(req.params.page_name).digest('base64') #TODO: propably not needed
  compile.compileStatic cache_key, (error, content) ->
    client.get cache_key, (error, result) ->
      if !result
        client.set cache_key, content
        result = content
      res.send result.toString()

exports.save = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  firebase.push {key: req.params.page_name, content: req.params.content, owner: 1234}, (error) ->
    console.log "pushed" unless error
    res.send {error: error}