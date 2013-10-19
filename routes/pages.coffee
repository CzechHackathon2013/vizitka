logger         = require('../lib/logging').getLogger "default"
memcache			 = require('memcache')

client = new memcache.Client(11211, 'localhost');
client.connect()

client.on 'connect', ->
  logger.info "connected to memcache #{this}"

exports.index = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
  client.set 'page_key', 'ahoj z memcache'
  client.get 'page_key', (error, result) ->
	    res.send result