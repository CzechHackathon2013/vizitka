var PageView = require('./base');
var templates = require('../templates');

module.exports = PageView.extend({
  template: templates.pages.edit,
  render: function () {
    this.renderAndBind();
  }
});
