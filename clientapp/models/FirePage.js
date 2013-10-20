var HumanModel = require('human-model');
var _ = require('underscore');

module.exports = HumanModel.define({
  type: 'firePage',
  props: {
    key: ['string', false, undefined],
  },
  session: {
    active: ['boolean', true, false]
  },
  initWithKey: function (key) {
    this.key = key;
  }
});
