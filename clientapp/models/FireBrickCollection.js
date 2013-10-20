var Backbone = require('backbone');
var FireBrick = require('./FireBrick');
var _ = require('underscore');

module.exports = Backbone.Firebase.Collection.extend({
  model: FireBrick
});