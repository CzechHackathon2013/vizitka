logger         = require('../lib/logging').getLogger "default"
memjs			     = require('memjs')
crypto				 = require('crypto')

config         = require '../lib/config'

client = new memjs.Client.create()

exports.show = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  content = "ahoj z memcache pro #{req.params.name} vygenerovano #{new Date().getTime()}"
  key_hash = crypto.createHash('sha1')
  cache_key = key_hash.update(req.params.name).digest('base64') #TODO: propably not needed
  client.get cache_key, (error, result) ->
    console.log result
    if !result
      client.set cache_key, content
      result = content
    console.error result
    res.send result.toString()