/*global $*/
// base view
var HumanView = require('human-view');
var _ = require('underscore');
var cssUtils = require('../helpers/cssUtils');


module.exports = HumanView.extend({
  render: function () {
    this.renderAndBind();
    this.$el.addClass('hidden');

    return this;
  },
  // register keyboard handlers
  registerKeyboardShortcuts: function () {
    /*
     var self = this;
     _.each(this.keyboardShortcuts, function (value, k) {
     // register key handler scoped to this page
     key(k, self.cid, _.bind(self[value], self));
     });
     key.setScope(this.cid);
     */
  },
  unregisterKeyboardShortcuts: function () {
    //key.deleteScope(this.cid);
  },
  show: function (animation) {

    // set the class so it comes into view
    cssUtils.cssShow(this.$el);

    return this;
  },
  hide: function () {
    // hide the page
    cssUtils.cssHide(this.$el);

    return this;
  }
});
