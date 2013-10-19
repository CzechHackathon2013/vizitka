var jade = require("jade");

/**
 *
 * @param data contains { meta:, data: }
 * @param pageContext page variables, now { theme: theme definition}
 * @param callback (err, result html)
 */
exports.renderPage = function(content, template, callback) {
  var filename = __dirname + '/../../../clienttemplates/themes/' + content.theme + '/index.jade';
  var opt = { filename: content.theme + "/index", pretty: true, content: content };
  jade.renderFile(filename, opt, function(err, html) {
    callback(err, html);
  });
};

/**
 *
 * @param brickType string id
 * @param brickContent content object
 * @param pageContext same as for renderPage
 * @param callback (err, result html)
 */
exports.renderBrick = function(brickType, brickContent, pageContext, callback) {
  callback(null, 'this is a brick');
};

