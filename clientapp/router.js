/*global app, me, $*/
var Backbone = require('backbone');
var HomePage = require('./pages/home');
// var CollectionDemo = require('./pages/collectionDemo');
var EditPage = require('./pages/edit');


module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    // 'login': 'login',
    // 'collections': 'collectionDemo',
    // 'info': 'info'
  },

  // ------- ROUTE HANDLERS ---------

  home: function () {
    app.renderPage(new HomePage({
      model: null
    }));
  },

  /*
   edit: function () {
   app.renderPage(new EditPage({
   model: null
   }));
   }
   */
});
