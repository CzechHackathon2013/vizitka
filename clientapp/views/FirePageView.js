var HumanView = require('human-view');
var templates = require('../templates');
var FireBrickView = require('./FireBrickView');


module.exports = HumanView.extend({
  template: templates.views.firePageView,
  textBindings: {
    key: '.key'
  },
  classBindings: {
    'active': ''
  },
  events: {
    'click a': 'switchToPage',
    'keyup .edit-page': 'userEditedSource'
  },
  render: function () {
    this.renderAndBind();

    this.$textarea = this.$('.edit-page');
    this.$link = this.$('a.key');

    // TODO: change, not *
    this.listenToAndRun(this.model, '*', _.bind(function () {
      // console.log(this.model.key, this.model, this.model.bricks);
      this.renderCollection(this.model.bricks, FireBrickView, this.$('.bricks')[0]);

      // update link
      this.$link.attr('href', this.model.pageUrl);
      this.$link.attr('target', '_blank');
    
      // update textarea, keep cursor
      var t = this.$textarea[0];
      var sel = getInputSelection(t);
      // this.$textarea.val(this.model.jsonText);
      t.value = this.model.jsonText;
      setInputSelection(t, sel.start, sel.end);
      this.$textarea.focus();


    }, this));
  },
  switchToPage: function () {
    app.user.firebaseUser.pages.map(_.bind(function(page, i) {
      page.active = (page == this.model);
    }, this));
    // app.navigate('/edit/' + this.model.key);
  },
  userEditedSource: function () {
    var json = this.$textarea.val();

    this.model.updateJsonFromText(json);
  }
});


function getInputSelection(el) {
  var start = 0, end = 0, normalizedValue, range,
    textInputRange, len, endRange;

  if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    range = document.selection.createRange();

    if (range && range.parentElement() == el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, "\n");

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart("character", -len);
        start += normalizedValue.slice(0, start).split("\n").length - 1;

        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd("character", -len);
          end += normalizedValue.slice(0, end).split("\n").length - 1;
        }
      }
    }
  }

  return {
    start: start,
    end: end
  };
}

function offsetToRangeCharacterMove(el, offset) {
  return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
}

function setInputSelection(el, startOffset, endOffset) {
  if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
    el.selectionStart = startOffset;
    el.selectionEnd = endOffset;
  } else {
    var range = el.createTextRange();
    var startCharMove = offsetToRangeCharacterMove(el, startOffset);
    range.collapse(true);
    if (startOffset == endOffset) {
      range.move("character", startCharMove);
    } else {
      range.moveEnd("character", offsetToRangeCharacterMove(el, endOffset));
      range.moveStart("character", startCharMove);
    }
    range.select();
  }
}