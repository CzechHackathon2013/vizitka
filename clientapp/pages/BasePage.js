/*global $*/
// base view for pages
var HumanView = require('human-view');
var BaseView = require('../views/BaseView');
var _ = require('underscore');
//var key = require('keymaster');


module.exports = BaseView.extend({
  /*
  render: function () {
    this.renderAndBind();

    return this;
  },
  */
  show: function (animation) {
    var self = this;

    // register page-specific keyboard shortcuts
    //this.registerKeyboardShortcuts();

    // scroll page to top
    $('body').scrollTop(0);

    // handle cached pages
    if (this.detached) {
      this.$('#pages').append(this.el);
      this.detached = false;
    } else {
      // render the view
      this.render();
    }

    // if there's a data method, call it with a callback
    if (this.data) {
      this.data(_.bind(function () {
        this.trigger('pagedataloaded');
      }, this));
    }

    BaseView.prototype.show.apply(this, arguments);

    // set the document title
    document.title = _.bind(function () {
      var title = _.result(this, 'title');
      return title ? title + ' • cardolin' : 'cardolin';
    },this)();

    // trigger an event to the page model in case we want to respond
    this.trigger('pageloaded');

    return this;
  },
  hide: function () {
    this.$el.removeClass('active');

    BaseView.prototype.hide.apply(this, arguments);

    this.trigger('pageunloaded');

    // if it's cached just detach it
    if (this.cache) {
      // hide the page
      this.$el.detach();
      this.detached = true;
    } else {
      // unbind all events bound for this view
      this.animateRemove();
    }

    // unbind page-specific keyboard shortcuts
    //this.unregisterKeyboardShortcuts();
    return this;
  }
});
