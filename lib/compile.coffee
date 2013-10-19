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

exports.compileStatic = (content, cb) ->
  data =
    theme: 'dev'
    name: 'page1'
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

  template =
    layout: 'layout.jade'
    bricks:
      meta: 'meta.jade'
      markdown: 'markdown.jade'
      image: 'image.jade'

  rune.renderPage content, template, cb
