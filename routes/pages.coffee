logger         = require('../lib/logging').getLogger "default"
memjs			     = require('memjs')
getconfig         = require 'getconfig'
Firebase       = require('firebase')

config         = require '../lib/config'
rune           = require '../clientapp/libraries/rune/rune.js'

client = new memjs.Client.create()
firebase = new Firebase(getconfig['client']['firebase']['endpoint'])

firebase.on 'value', (snapshot) ->
  console.log 'data updated over firebase', snapshot.val()

exports.show = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  cache_key = req.params.page_name
  client.get cache_key, (error, result) ->
    if !result
      firebase_ref_record = new Firebase(getconfig['client']['firebase']['endpoint'] + "pages/" + cache_key)
      firebase_ref_record.on 'value', (ref_data) ->
        res.send '404 not exist' unless ref_data.val()
        firebase_record = new Firebase(getconfig['client']['firebase']['endpoint'] + "users/" + ref_data.val().user_id + "/" + cache_key)
        firebase_record.on 'value', (data) ->
          res.send '500 error' unless data.val()
          rune.renderPage data.val(), (error, content) ->
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
  firebase.child('users').child(req.params.user_id).child(req.params.page_name).set data, (error) ->
    console.log "error push", error if error
    firebase.child('pages').child(req.params.page_name).set {user_id: req.params.user_id}, (error) ->
      console.log "error push ref", error if error
      res.json error

