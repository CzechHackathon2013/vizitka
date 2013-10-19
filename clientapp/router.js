/*global app, me, $*/
var Backbone = require('backbone');
var HomePage = require('./pages/home');
var LoginPage = require('./pages/login');
var CollectionDemo = require('./pages/collectionDemo');
var InfoPage = require('./pages/info');


module.exports = Backbone.Router.extend({
    routes: {
        '': 'home',
        'login': 'login',
        'collections': 'collectionDemo',
        'info': 'info'
    },

    // ------- ROUTE HANDLERS ---------
    login: function () {
        app.renderPage(new LoginPage({
          model: me
        }));
    },

    home: function () {
        app.renderPage(new HomePage({
            model: me
        }));
    },

    collectionDemo: function () {
        app.renderPage(new CollectionDemo({
            model: me,
            collection: app.people
        }));
    },

    info: function () {
        app.renderPage(new InfoPage({
            model: me
        }));
    }
});
