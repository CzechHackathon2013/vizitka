var HumanModel = require('human-model');
var FireUser = require('./FireUser');
var _ = require('underscore');

module.exports = HumanModel.define({
  type: 'user',
  props: {
    firebaseUserConfig: ['object', false, undefined],
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
    var auth = new window.FirebaseSimpleLogin(firebaseEndpoint, _.bind(_.once(function (error, user) {
      if (user && !error) {
        this.loginError = undefined;
        this.firebaseUserConfig = user;
        this.firebaseUser = new FireUser();
        this.firebaseUser.initWithUid(user.uid);

        app.trigger('login', this);
      } else {
        if (error) {
          // real error
          this.loginError = error;
        } else {
          // user cancelled
          this.loginError = undefined;
        }
        this.firebaseUserConfig = undefined;
        this.firebaseUser = undefined;
      }
    }), this));
    auth.login('facebook', {});
  },
  logout: function () {
    this.firebaseUser = undefined;
    app.trigger('logout', this);
  }
});
