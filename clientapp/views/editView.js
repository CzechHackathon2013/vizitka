var BaseView = require('./BaseView');
var _ = require('underscore');
var templates = require('../templates');

module.exports = BaseView.extend({
  template: templates.views.editView,
  render: function () {
    this.renderAndBind();

    return this;
  },
});
