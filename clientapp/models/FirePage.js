var HumanModel = require('human-model');
var FireBrickCollection = require('./FireBrickCollection');
var _ = require('underscore');
var utils = require('../helpers/utils');

module.exports = HumanModel.define({
  type: 'firePage',
  props: {
    key: ['string', false, undefined],
    name: ['string', false, undefined],
    theme: ['string', false, undefined],
    bricks: ['object', false, undefined],
    jsonSource: ['object', false, undefined],
  },
  session: {
    active: ['boolean', true, false]
  },
  derived: {
    jsonText: {
      deps: ['jsonSource'],
      cache: true,
      fn: function () {
        return utils.objectToJsonString(this.jsonSource);
      }
    },
    pageUrl: {
      deps: ['key'],
      cache: true,
      fn: function () {
        return "/pages/"+this.key;
      }
    }
  },
  initialize: function() {
    console.log('INITIALIAZLIZE');
    this.on('change:key', _.bind(function() {
      console.log('CHANGE KEY');
      this.initWithKey(this.key);
    }, this));
  },
  initWithKey: function (key) {
    this.key = key;

    this._pageUrl = app.config['firebase']['endpoint'] + 'users/' + app.user.firebaseUserConfig.uid + '/' + this.key;

    this._firebasePage = new window.Firebase(this._pageUrl);

    // TODO: listen on user and name changes
    this._valueChanged = _.bind(function(snapshot) {
      // console.log('VALUE CHANGED!!', snapshot.val(), this);
      this.name = snapshot.val()['name'];
      this.theme = snapshot.val()['theme'];
      this.jsonSource = snapshot.val();
    }, this);

    this._firebasePage.on('value', this._valueChanged);

    // TODO: bricks need to know about their parent

    this.bricks = new FireBrickCollection([], {
      firebase: new window.Firebase( this._pageUrl + '/bricks' )
    });

  },
  stopListening: function() {
    // TODO: stop listening on collection
    this._firebasePage.off('value', this._valueChanged);
  },
  updateJsonFromText: function(text) {
    try {
      var data = JSON.parse(text);
      this._firebasePage.set(data, _.bind(function(error){
        if (error) {
          console.log('error saving:', error);
        }
      }, this));
      return true;
    } catch(e) {
     return false;
    }
  }
});
