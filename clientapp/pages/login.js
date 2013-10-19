var PageView = require('./base');
var templates = require('../templates');
var _ = require('underscore');

module.exports = PageView.extend({
  title: 'login',
  template: templates.pages.login,
  events: {
    'click .login': 'login'
  },
  render: function () {
    this.renderAndBind();

    app.user.on('change:loginError', _.bind(function() {

      var $error = $(this.el).find('.alert');
      if (app.user.loginError) {
        $error.text(app.user.loginError);
        $error.removeClass('hidden');
      } else {
        $error.addClass('hidden');
      }
      console.log(this.el, $(this.el), app.user.loginError, $error);
    }, this))
  },
  // TODO: on enter - if logged in, return to last page or home
  login: function() {
    app.user.login();
  }
});
