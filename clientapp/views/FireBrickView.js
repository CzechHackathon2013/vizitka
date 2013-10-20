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

    this.$content = this.$('.content');
    // debugger;

    var self = this;

    // listen
    this.listenToAndRun(this.model, '*', _.bind(function () {
      this.model.renderHtml(function(err, html) {
        // TODO: why doesn't bind work here?

        if (err) {
          console.log('error rendering html:', err);
          self.$content.html(err.message);
        } else {
          self.$content.html(html);
        }
      });
    }, this));
  }
});