var HumanModel = require('human-model');
var _ = require('underscore');

module.exports = HumanModel.define({
  type: 'fireDocument',
  props: {
    firebase: ['object', false, undefined],
    root: ['string', false, undefined],
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
  initWithRoot: function(root) {
    // unsubscribe
    var oldRoot = this.root;
    if (oldRoot != null) {

    }

    // subscribe

  }
});
