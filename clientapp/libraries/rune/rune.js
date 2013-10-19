var jade = require("jade");

/**
 *
 * @param data contains { meta:, data: }
 * @param pageContext page variables, now { theme: theme definition}
 * @param callback (err, result html)
 */
exports.renderPage = function(data, pageContext, callback) {
  var filename = __dirname + '/../../views/themes/' + pageContext.theme.id + '/index.jade';
  var opt = { filename: pageContext.theme.id + "/index", pretty: true, data: data };
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

