logger         = require('../lib/logging').getLogger "default"
memjs			     = require 'memjs'
getconfig      = require 'getconfig'
Firebase       = require 'firebase'

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
        unless ref_data.val()
          res.send 404, 'not exist'
          return
        firebase_record = new Firebase(getconfig['client']['firebase']['endpoint'] + "users/" + ref_data.val().user_id + "/" + cache_key)
        firebase_record.on 'value', (data) ->
          unless data.val()
           res.send 500, '500 error'
           return
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
    "name" : "user1",
    "theme" : "cardolin"
    "bricks" : [ {
      "type" : "meta",
      "content" : {
        "linkedin" : "http://www.linkedin.com/in/chemix",
        "description" : "I work as Digital Alchemist (ideas, programing, design, ...) in @KreativniLab I'm also broadcaster at DIY radio @StreetCultureCZ and co-organizer @Prague_CM",
        "photo" : "https://0.gravatar.com/avatar/3799bbab02e9da1b0c4b6f38eb2a3b63?d=https%3A%2F%2Fidenticons.github.com%2F640a7ed507c48b905ef6fe2073f471d5.png&s=420",
        "twitter" : "http://twitter.com/iamchemix",
        "name" : "Honza Černý",
        "email" : "hello@honzacerny.com",
        "facebook" : "http://facebook.com/chemix.cz",
        "tagline" : "Digital Alchemist",
        "phone" : "+420 777 148 481"
      }
    }, {
      "type" : "markdown",
      "content" : {
        "source" : "Je to už nějaký ten pátek co jsem poprvé zmáčkl tlačítka start na svém počítači a začal zkoumat svět jedniček a nul."
      }
    }, {
      "type" : "portfolio",
      "content" : {
        "role" : "frontend and backend developer",
        "url" : "http://www.shadowbox.cz",
        "subtitle" : "Drum and Bass magazin and Dj's crew",
        "description" : "Hudebí magazín shadowbox.cz ",
        "title" : "Shadowbox.cz",
        "alt" : "SHADOWBOX",
        "image" : "http://cdn.dropmark.com/31002/ff9e50c15fc1974e2a55267661df1549fe624f17/Screen%20Shot%202013-10-19%20at%2011.29.25%20PM.png"
      }
    }, {
      "type" : "image",
      "content" : {
        "description" : "Demivoto je diskuzní pořad na rádiu StreetCulture, jehož tématem je neziskový sektor.",
        "alt" : "Demivoto",
        "image" : "https://scontent-b-mxp.xx.fbcdn.net/hphotos-prn2/1393585_639484106082935_524551600_n.jpg"
      }
    } ],



  new Firebase(getconfig['client']['firebase']['endpoint'] + "pages/" + req.params.page_name).on 'value', (check_data) ->
    if check_data.val()
      res.send 'name already taken'
    else
      firebase.child('users').child(req.params.user_id).child(req.params.page_name).set data, (error) ->
        console.log "error push", error if error
        firebase.child('pages').child(req.params.page_name).set {user_id: req.params.user_id}, (error) ->
          console.log "error push ref", error if error
          res.json error

#TODO: refactor/wrap model storage access