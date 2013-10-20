var Backbone = require('backbone');
var HumanModel = require('human-model');
var FirePageCollection = require('./FirePageCollection');
var FirePage = require('./FirePage');
var _ = require('underscore');
var utils = require('../helpers/utils');

module.exports = HumanModel.define({
  type: 'fireUser',
  props: {
    firebaseUser: ['object', false, undefined],
    userId: ['string', false, undefined],
    pages: ['object', true, new FirePageCollection()],
    isEmpty: ['boolean', true, true],
  },
  derived: {
    /*
     fullName: {
     deps: ['firstName', 'lastName'],
     cache: true,
     fn: function () {
     return this.firstName + ' ' + this.lastName;
     }
     }
     */
  },
  // eg. https://min-vizitka.firebaseio.com/users/659783637/chemix
  initWithUserId: function(id) {
    if (this.userId) {
      // remove old handlers
      this.stopListening();
    }

    console.log('FireUser.initWithUserID', id);

    this.userId = id;
    this.firebaseUser = new window.Firebase(app.config['firebase']['endpoint'] + 'users/' + id);

    this._valueChanged = _.bind(function(snapshot) {
      if(snapshot.val() === null) {
        this.pages.reset([]);
      } else {
        /*
         this.pages = Backbone.Firebase.Collection.extend({
         model:
         });
         */

        var val = snapshot.val();
        this.pages.reset(utils.objKeys(val).map(_.bind(function(key) {
          var page = new FirePage();
          page.initWithKey(key);
          return page;
        }, this)));
      }
      this.isEmpty = (this.pages.length == 0);
    }, this);

    this.firebaseUser.on('value', this._valueChanged);
  },
  stopListening: function() {
    this.firebaseUser.off('value', this._valueChanged);
  }
});
