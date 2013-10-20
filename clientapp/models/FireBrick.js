var HumanModel = require('human-model');
var _ = require('underscore');
var utils = require('../helpers/utils');

module.exports = HumanModel.define({
  type: 'fireBrick',
  props: {
    type: ['string', false, undefined],
    content: ['object', false, undefined],
  },
  derived: {
    contentJson: {
      deps: ['content'],
      cache: true,
      fn: function () {
        return utils.objectToJsonString(this.content);
      }
    }
  },
  session: {
    // active: ['boolean', true, false]
  },
  /*
  initWithUrlContentAndType: function (url, content, type) {
    console.log('initWithUrlContentAndType', url, content, type);

    this._url = url;
    this.type = type;
    this.content = content;
  }
  */
});
