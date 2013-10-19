logger         = require('../lib/logging').getLogger "default"
memjs			     = require('memjs')
#crypto				 = require('crypto')

config         = require '../lib/config'
compile         = require '../lib/compile'

client = new memjs.Client.create()

exports.show = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"
#  key_hash = crypto.createHash('sha1')
  cache_key = "page_#{req.params.page_name}"
#  cache_key = key_hash.update(req.params.page_name).digest('base64') #TODO: propably not needed
  compile.compileStatic cache_key, (error, content) ->
    client.get cache_key, (error, result) ->
      if !result
        client.set cache_key, content
        result = content
      res.send result.toString()