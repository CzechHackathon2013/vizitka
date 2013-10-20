var BaseView = require('./BaseView');
var FirePageView = require('./FirePageView');
var _ = require('underscore');
var templates = require('../templates');


module.exports = BaseView.extend({
  template: templates.views.editView,
  render: function () {
    this.renderAndBind();

    // listen
    this.listenToAndRun(app, 'login logout', _.bind(function () {
      if (app.user.firebaseUser) {
        // login
        this.renderCollection(app.user.firebaseUser.pages, FirePageView, this.$('.user-pages')[0]);
        this.$('.uid').text(app.user.firebaseUserConfig.uid);
      } else {
        // TODO: stop rendering collection
      }
    }, this));



    return this;
  },
});
