var Backbone = require('backbone');
var FirePage = require('./FirePage');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
  model: FirePage
});