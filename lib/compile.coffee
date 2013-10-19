logger         = require('../lib/logging').getLogger "default"
swig           = require 'swig'

rune           = require '../clientapp/libraries/rune/rune.js'


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

  data =
    meta:
      theme: 'plain'
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

  pageContext =
    theme:
      name: 'Plain theme'
      id: 'plain'
      template:
        layout: 'plain/layout.jade'
        bricks:
          meta: 'meta.jade'
          markdown: 'markdown.jade'
          image: 'image.jade'

  rune.renderPage data, pageContext, (cb)

exports.compileStatic_old = (key, data, cb) ->
  swig.compileFile __dirname + '/../views/card-data.html', {}, (err, tpl) ->
    cb err, null if err
    html = tpl { myname: key, mycontent: data.content }
    cb err, html