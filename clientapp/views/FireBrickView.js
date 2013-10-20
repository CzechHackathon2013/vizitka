var HumanView = require('human-view');
var templates = require('../templates');


module.exports = HumanView.extend({
  template: templates.views.fireBrickView,
  textBindings: {
    type: '.type',
    contentJson: '.contentJson'
  },
  render: function () {
    this.renderAndBind();
  }
});