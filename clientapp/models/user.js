var HumanModel = require('human-model');
var FireUser = require('./FireUser');
var _ = require('underscore');
//var Firebase = require('firebase');

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
        
        this.create_default_page(user);

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
  },
  create_default_page: function (user) {
    var data = {
      "name": "user1",
      "theme": "cardolin",
      "bricks": [
        {
          "type": "meta",
          "content": {
            "linkedin": "http://www.linkedin.com/in/chemix",
            "description": "I work as Digital Alchemist (ideas, programing, design, ...) in @KreativniLab I'm also broadcaster at DIY radio @StreetCultureCZ and co-organizer @Prague_CM",
            "photo": "https://0.gravatar.com/avatar/3799bbab02e9da1b0c4b6f38eb2a3b63?d=https%3A%2F%2Fidenticons.github.com%2F640a7ed507c48b905ef6fe2073f471d5.png&s=420",
            "twitter": "http://twitter.com/iamchemix",
            "name": "Honza Černý",
            "email": "hello@honzacerny.com",
            "facebook": "http://facebook.com/chemix.cz",
            "tagline": "Digital Alchemist",
            "phone": "+420 777 148 481"
          }
        }, {
          "type": "markdown",
          "content": {
            "source": "Je to už nějaký ten pátek co jsem poprvé zmáčkl tlačítka start na svém počítači a začal zkoumat svět jedniček a nul."
          }
        }, {
          "type": "portfolio",
          "content": {
            "role": "frontend and backend developer",
            "url": "http://www.shadowbox.cz",
            "subtitle": "Drum and Bass magazin and Dj's crew",
            "description": "Hudebí magazín shadowbox.cz ",
            "title": "Shadowbox.cz",
            "alt": "SHADOWBOX",
            "image": "http://cdn.dropmark.com/31002/ff9e50c15fc1974e2a55267661df1549fe624f17/Screen%20Shot%202013-10-19%20at%2011.29.25%20PM.png"
          }
        }, {
          "type": "image",
          "content": {
            "description": "Demivoto je diskuzní pořad na rádiu StreetCulture, jehož tématem je neziskový sektor.",
            "alt": "Demivoto",
            "image": "https://scontent-b-mxp.xx.fbcdn.net/hphotos-prn2/1393585_639484106082935_524551600_n.jpg"
          }
        }
      ]
    };
    var name = user.username.replace('.', '_');
    var r = new Firebase(app.config['firebase']['endpoint'] + "pages/" + name).on('value', function(check_data) {
      if (check_data.val()) {
        console.log('name already taken', user, name);
        return;
      } else {
        return new Firebase(app.config['firebase']['endpoint']).child('users').child("facebook:"+user.id).child(name).set(data, function(error) {
          if (error) {
            console.log("error push", error);
          }
          return new Firebase(app.config['firebase']['endpoint']).child('pages').child(name).set({
            user_id: "facebook:"+user.id
          }, function(error) {
            if (error) {
              console.log("error push ref", error);
            }
          });
        });
      }
    });
    
  }
});
