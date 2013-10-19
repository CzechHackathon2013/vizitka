logger         = require('../lib/logging').getLogger "default"
memjs			     = require('memjs')
#crypto				 = require('crypto')
getconfig         = require 'getconfig'
Firebase       = require('firebase')

config         = require '../lib/config'
compile         = require '../lib/compile'

client = new memjs.Client.create()
firebase = new Firebase(getconfig['client']['firebase']['endpoint'] + "pages/")

firebase.on 'value', (snapshot) ->
  console.log 'data updated over firebase', snapshot.val()

exports.show = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
#  key_hash = crypto.createHash('sha1')
  cache_key = req.params.page_name
  client.get cache_key, (error, result) ->
    if !result
      firebase_record = new Firebase(getconfig['client']['firebase']['endpoint'] + "pages/" + cache_key)
      firebase_record.on 'value', (data) ->
        res.send '404 not exist' unless data.val()
        compile.compileStatic data.val(), (error, content) ->
          console.log data.val()
          console.log error, content
          client.set data.val().name, content
          res.send content.toString()
    else
      res.send result.toString()

exports.save = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  data =
    name: 'user1'      
    theme: 'cardolin'
    bricks: [{
      type: 'meta'
      content:
        name: 'Chemix'
        tagline: 'I am chemix'
        description: 'lorem ipsum'
        photo: 'http://blog.lafraise.com/fr/wp-content/uploads/2009/10/Chemix.jpg'
    }, {
      type: 'markdown'
      content:
        source: 'Markdown will be here probably'
    }, {
      type: 'image'
      content:
        image: 'http://blog.lafraise.com/fr/wp-content/uploads/2009/10/Chemix.jpg'
        alt: 'Chemix'
        description: 'some markdown, optional'
    }]
  firebase.child(req.params.page_name).set data, (error) ->
    console.log "error push", error if error
    res.json error
