var HumanView = require('human-view');
var templates = require('../templates');


module.exports = HumanView.extend({
  template: templates.views.firePageView,
  textBindings: {
    key: '.key'
  },
  /*
  srcBindings: {
    'avatar': '.avatar'
  },
  events: {
    'click .delete': 'handleRemoveClick'
  },
  */
  render: function () {
    this.renderAndBind();
  },
  /*
  handleRemoveClick: function () {
    this.model.destroy();
  }
  */
});