/**
 *
 * @param data contains { meta:, data: }
 * @param pageContext page variables, now { theme: theme definition}
 * @param callback (err, result html)
 */
exports.renderPage = function(data, pageContext, callback) {
  callback(null, '<div class="page">hello!</div>');
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

