var HumanModel = require('human-model');
var FirePageCollection = require('./FirePageCollection');
var _ = require('underscore');
var utils = require('../helpers/utils');

module.exports = HumanModel.define({
  type: 'fireUser',
  props: {
    firebaseUser: ['object', false, undefined],
    pages: ['object', true, new FirePageCollection()],
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
    this.firebaseUser = new window.Firebase(app.config['firebase']['endpoint'] + 'users/' + id);
    this.firebaseUser.once('value', function(snapshot) {
      if(snapshot.val() === null) {
        alert('User ' + id + ' does not exist.');
        // TODO: handle/create
      } else {
        var cal = snapshot.val();
        utils.objKeys(val).map(_.bind(function(key) {
          this.pages.add
          val[key]
        }, this));

        var firstName = snapshot.val().name.first;
        var lastName = snapshot.val().name.last;
        alert('User julie’s full name is: ' + firstName + ' ' + lastName);
      }
    });

  },
  stopListening: function() {
    // TODO
  }
});
