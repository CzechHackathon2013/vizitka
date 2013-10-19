/*global app, me, $*/
// This app view is responsible for rendering all content that goes into
// <html>. It's initted right away and renders iteslf on DOM ready.

// This view also handles all the 'document' level events such as keyboard shortcuts.
var HumanView = require('human-view');
var _ = require('underscore');
var templates = require('../templates');
var tracking = require('../helpers/metrics');
var setFavicon = require('favicon-setter');
var cssUtils = require('../helpers/cssUtils');



module.exports = HumanView.extend({
  template: templates.body,
  initialize: function () {
    // this marks the correct nav item selected
    app.history.on('route', this.updateActiveNav, this);
  },
  events: {
    'click a[href]': 'handleLinkClick',
    'click .login button': 'login',
    'click .logout button': 'logout'
  },
  render: function () {
    // some additional stuff we want to add to the document head
    $('head').append(templates.head());

    // scripts
    app.externalScripts.map(function (scriptUrl) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = scriptUrl;
      document.body.appendChild(script);
    });

    // main renderer
    this.renderAndBind({user: app.user});

    // setting a favicon for fun (note, it's dyanamic)
    setFavicon('/images/ampersand.png');

    // save sub items
    this.$login = $(this.el).find('.login');
    this.$logout = $(this.el).find('.logout');
    this.$logoutName = $(this.el).find('.logout .name');
    this.$error = $(this.el).find('.alert');

    // listen
    this.listenToAndRun(app, 'login logout', _.bind(function () {
      if (app.user.firebaseUser) {
        // login
        cssUtils.cssHide(this.$login);
        cssUtils.cssShow(this.$logout);
        this.$logoutName.text(app.user.firebaseUser.name)
      } else {
        // logout
        cssUtils.cssHide(this.$logout);
        cssUtils.cssShow(this.$login);
      }
    }, this));

    this.listenToAndRun(app.user, 'change:loginError', _.bind(function () {
      if (app.user.loginError) {
        this.$error.text(app.user.loginError);
        cssUtils.cssShow(this.$error);
      } else {
        cssUtils.cssHide(this.$error);
      }
    }, this));

    // Init and "render()" a subview for a hypothetical
    // navigation view
    /*
     this.navView = new NavigationView({
     el: this.$('#mainNav')[0],
     model: this.model
     }).render();
     */


    return this;
  },

  login: function () {
    app.user.login();
  },
  logout: function () {
    app.user.logout();
  },


  handleLinkClick: function (e) {
    var t = $(e.target);
    var aEl = t.is('a') ? t[0] : t.closest('a')[0];
    var local = window.location.host === aEl.host;
    var path = aEl.pathname.slice(1);

    // if the window location host and target host are the
    // same it's local, else, leave it alone
    if (local) {
      app.navigate(path);
      return false;
    }
  },

  updateActiveNav: function () {
    var pathname = window.location.pathname;
    $('.nav a').each(function () {
      var navArray = _.compact($(this).attr('href').split('/')).join('/').toLowerCase();
      var pathArray = _.compact(pathname.split('/')).join('/').toLowerCase();

      if (pathArray === navArray) {
        $(this).parent().addClass('active');
      } else {
        $(this).parent().removeClass('active');
      }
    });
  }
});
