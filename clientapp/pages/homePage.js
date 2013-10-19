var BasePage = require('./BasePage');
var templates = require('../templates');
var _ = require('underscore');

var HomeView = require('../views/HomeView');
var EditView = require('../views/EditView');

module.exports = BasePage.extend({
  title: 'home',
  template: templates.pages.homePage,
  render: function () {
    this.renderAndBind();

    // Init and "render()" subviews
    this.homeView = new HomeView({
      el: this.$el.find('#home')[0],
      model: this.model
    }).render();

    this.editView = new EditView({
      el: this.$el.find('#edit')[0],
      model: this.model
    }).render();

    // listen
    this.listenToAndRun(app, 'login logout', _.bind(function () {
      if (app.user.firebaseUser) {
        // login
        this.homeView.hide();
        this.editView.show();
      } else {
        // logout
        this.homeView.show();
        this.editView.hide();
      }
    }, this));

  }
});
