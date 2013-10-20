var HumanModel = require('human-model');
var _ = require('underscore');

module.exports = HumanModel.define({
  type: 'firePage',
  props: {
    key: ['string', false, undefined],
  },
  initWithKey: function (key) {
    this.key = key;
  }
});
