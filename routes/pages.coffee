logger         = require('../lib/logging').getLogger "default"
memcache			 = require('memcache')
crypto				 = require('crypto')

client = new memcache.Client(11211, 'localhost');
client.connect()

client.on 'connect', ->
  logger.info "connected to memcache"

exports.show = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  content = "ahoj z memcache pro #{req.params.name} vygenerovano #{new Date().getTime()}"
  key_hash = crypto.createHash('sha1')
  cache_key = key_hash.update(req.params.name).digest('base64') #TODO: propably not needed
  client.get cache_key, (error, result) ->
    if !result
      client.set cache_key, content
      result = content
    res.send result