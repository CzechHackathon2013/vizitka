var HumanModel = require('human-model');
var _ = require('underscore');

module.exports = HumanModel.define({
    type: 'user',
    props: {
        id: ['string'],
        loginToken: ['string', false, null],
        loginError: ['string', false, null],
        firstName: ['string', true, ''],
        lastName: ['string', true, ''],
        username: ['string'],
    },
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
  login: function() {
    var firebaseEndpoint = new window.Firebase(app.config['firebase']['endpoint']);

    var auth = new window.FirebaseSimpleLogin(firebaseEndpoint, _.bind(function(error, user) {
      if (!error) {
        this.loginToken = 'xxx'; // TODO: get from user
        console.log('user', user);
        app.trigger('login', this);
        app.navigate('/');
      } else {
        this.loginError = error;
        alert('Login error:' + error); // blergh :)
      }
    }), this);
    auth.login('facebook', {});
  }
});
