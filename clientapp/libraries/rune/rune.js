var jade = require("jade");

/**
 *
 * @param content contains { meta:, data: }
 * @param callback (err, result html)
 */
exports.renderPage = function (content, callback) {
  var filename = __dirname + '/../../../clienttemplates/themes/' + content.theme + '/index.jade';
  var opt = { filename: content.theme + "/index", pretty: true, data: content };
  jade.renderFile(filename, opt, function (err, html) {
    callback(err, html);
  });
};

/**
 *
 * @param brickData brickData object
 * @param theme name of theme
 * @param callback (err, result html)
 */
exports.renderBrick = function (brickData, theme, callback) {
  var filename = __dirname + '/../../../clienttemplates/themes/' + theme + '/' + brickData.type + '.jade';
  var opt = { filename: theme + '/' + brickData['type'], pretty: true, context: brickData.content };
  jade.renderFile(filename, opt, function (err, html) {
    callback(err, html);
  });
};

