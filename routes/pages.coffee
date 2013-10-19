logger         = require('../lib/logging').getLogger "default"
memcache			 = require('memcache')
crypto				 = require('crypto')

client = new memcache.Client(11211, 'localhost');
client.connect()

client.on 'connect', ->
  logger.info "connected to memcache"

exports.show = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  key_hash = crypto.createHash('sha1')
  cache_key = key_hash.update(req.params.name).digest('base64')
  client.set cache_key, "ahoj z memcache pro #{req.params.name} vygenerovano #{new Date().getTime()}"
  client.get cache_key, (error, result) ->
	    res.send result