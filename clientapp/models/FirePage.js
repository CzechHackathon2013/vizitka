var HumanModel = require('human-model');
var FireBrickCollection = require('./FireBrickCollection');
var _ = require('underscore');

module.exports = HumanModel.define({
  type: 'firePage',
  props: {
    key: ['string', false, undefined],
    name: ['string', false, undefined],
    theme: ['string', false, undefined],
    bricks: ['object', false, undefined],
  },
  session: {
    active: ['boolean', true, false]
  },
  initWithKey: function (key) {
    this.key = key;

    this._pageUrl = app.config['firebase']['endpoint'] + 'users/' + app.user.firebaseUserConfig.uid + '/' + this.key;

    this._firebasePage = new window.Firebase(this._pageUrl);

    // TODO: listen on user and name changes

    /*
    this.bricks = new FireBrickCollection([], {
      firebase: new window.Firebase( this._pageUrl + '/bricks' )
    });
    */
    this.bricks = new FireBrickCollection([], {
      firebase: new window.Firebase( this._pageUrl + '/bricks' )
    });

  }
});
