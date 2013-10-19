var HumanModel = require('human-model');
var _ = require('underscore');

module.exports = HumanModel.define({
  type: 'user',
  props: {
    firebaseUser: ['object', false, undefined],

    loginError: ['string', false, undefined],
  },
  /*
   derived: {
   fullName: {
   deps: ['firstName', 'lastName'],
   cache: true,
   fn: function () {
   return this.firstName + ' ' + this.lastName;
   }
   },
   initials: {
   deps: ['firstName', 'lastName'],
   cache: true,
   fn: function () {
   return (this.firstName.charAt(0) + this.lastName.charAt(0)).toUpperCase();
   }
   }
   },
   */
  login: function () {
    var firebaseEndpoint = new window.Firebase(app.config['firebase']['endpoint']);
    var auth = new window.FirebaseSimpleLogin(firebaseEndpoint, _.bind(function (error, user) {
      if (user && !error) {
        this.loginError = undefined;
        this.firebaseUser = user;

        console.log('user', user);

        app.trigger('login', this);
      } else {
        this.loginError = error;
        this.firebaseUser = undefined;
      }
    }, this));
    auth.login('facebook', {});
  },
  logout: function () {
    this.firebaseUser = undefined;
    app.trigger('logout', this);
  }
});
