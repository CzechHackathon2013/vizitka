var PageView = require('./base');
var templates = require('../templates');

module.exports = PageView.extend({
  title: 'login',
  template: templates.pages.login,
  events: {
    'click .login': 'login'
  },
  render: function () {
    this.renderAndBind();
  },
  // TODO: on enter - if logged in, return to last page or home
  login: function() {
    app.user.login();
  }
});
