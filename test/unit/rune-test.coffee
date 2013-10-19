async       = require 'async'
{assert}    = require 'chai'
sinon       = require 'sinon'

rune        = require '../../clientapp/models/rune.js'

themes = {
	plain: {
		name: 'Plain theme',
		id: 'plain',
		template: {
			layout: 'plain/layout.jade',
			bricks: {
				meta: 'meta.jade'
				markdown: 'markdown.jade'
				image: 'image.jade'
			}
		}
	}
}
theme = themes.plain;

data = {
	meta: {
		theme: 'plain'
	},
	bricks: [
		{
			type: 'meta',
			content: {
				name: 'Chemix',
				tagline: 'I am chemix',
				description: 'lorem ipsum'
				photo: 'http://blog.lafraise.com/fr/wp-content/uploads/2009/10/Chemix.jpg'
			}
		},
		{
			type: 'markdown',
			content: {
				source: 'Markdown will be here probably',
			}
		},
		{
			type: 'image',
			content: {
				image: 'http://blog.lafraise.com/fr/wp-content/uploads/2009/10/Chemix.jpg',
				alt: 'Chemix',
				description: 'some markdown, optional'
			}
		},
	]
}

pageContext = {
	theme: themes.plain
}

describe 'Rune render test', ->
	beforeEach ->
		# stub = sinon.stub graphite, "request"
		# by default on no url match, return cb(=no.1 arg) error, null
		# stub.callsArgWith(1, new Error("Wrong request url error"), null)

	afterEach ->
		# stub.restore()

	it 'renders the page', (done) ->
		rune.renderPage data, pageContext, (err, html) ->
			assert.ok html.match(/hello!/)
			done()
