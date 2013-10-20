var HumanView = require('human-view');
var templates = require('../templates');


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
  },
  switchToPage: function () {
    app.user.firebaseUser.pages.map(_.bind(function(page, i) {
      page.active = (page == this.model);
    }, this));
    // app.navigate('/edit/' + this.model.key);
  }
});