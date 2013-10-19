logger         = require('../lib/logging').getLogger "default"

exports.index = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"

  res.send "ahoj"