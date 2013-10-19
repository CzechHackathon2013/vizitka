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
  login: function() {
    this.model.login();
  }
});
