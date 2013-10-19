logger         = require('../lib/logging').getLogger "default"

exports.index = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"

  res.render 'index',
    title: "Some title"
    value: 0
    data: [{
      file: 'partials/file.html'
      fields: [1,2,3]
    }]