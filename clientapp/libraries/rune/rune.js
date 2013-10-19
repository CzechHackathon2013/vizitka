var jade = require("jade");
var marked = require("marked");
var async = require("async");

marked.setOptions({
  gfm: true,
  highlight: null,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

/**
 *
 * @param content contains { meta:, data: }
 * @param callback (err, result html)
 */
exports.renderPage = function(content, callback) {
  content = unmarkPage(content);
  console.error(content);
  var filename = __dirname + '/../../../clienttemplates/themes/' + content.theme + '/index.jade';
  var opt = { filename: content.theme + "/index", pretty: true, data: content };
  jade.renderFile(filename, opt, function(err, html) {
    callback(err, html);
  });
};

/**
 *
 * @param brickData brickData object
 * @param theme name of theme
 * @param callback (err, result html)
 */
exports.renderBrick = function(brickData, theme, callback) {
  brickData = unmarkBrick(brickData);
  var filename = __dirname + '/../../../clienttemplates/themes/' + theme + '/' + brickData.type + '.jade';
  var opt = { filename: theme + '/' + brickData['type'], pretty: true, context: brickData.content };
  jade.renderFile(filename, opt, function(err, html) {
    callback(err, html);
  });
};

var unmarkPage = function(content){
  for (var i = 0; i < content.length; i++) {
    content.bricks[i] = unmarkBrick(content.bricks[i]);
  }
  return content;
};

var unmarkBrick = function(brickData){
  for (var key in brickData.content) {
    brickData.content[key] = marked(brickData.content[key]);
  }
  return brickData;
};
