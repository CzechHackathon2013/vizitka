var HumanView = require('human-view');
var templates = require('../templates');
var FireBrickView = require('./FireBrickView');


module.exports = HumanView.extend({
  template: templates.views.firePageView,
  textBindings: {
    key: '.key'
  },
  classBindings: {
    'active': ''
  },
  events: {
    'click a': 'switchToPage'
  },
  render: function () {
    this.renderAndBind();

    // TODO: change, not *
    this.listenToAndRun(this.model, '*', _.bind(function () {
      console.log(this.model.key, this.model, this.model.bricks);
      this.renderCollection(this.model.bricks, FireBrickView, this.$('.bricks')[0]);
    }, this));
  },
  switchToPage: function () {
    app.user.firebaseUser.pages.map(_.bind(function(page, i) {
      page.active = (page == this.model);
    }, this));
    // app.navigate('/edit/' + this.model.key);
  }
});