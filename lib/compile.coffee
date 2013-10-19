logger         = require('../lib/logging').getLogger "default"
swig           = require 'swig'


exports.tpl = (req, res) ->
  logger.info "Received #{req.protocol} GET for #{req.url} from #{req.ip}"

  # precompile file
  swig.compileFile __dirname + '/../views/card-data.html', {}, (err, tpl) ->
    console.error tpl

    # generate html
    html = tpl { myname: "Pepa" }

    console.error html

    res.send html

exports.compileStatic = (key, cb) ->
  swig.compileFile __dirname + '/../views/card-data.html', {}, (err, tpl) ->
    cb err, null if err
    html = tpl { myname: "Pepa" }
    cb err, html