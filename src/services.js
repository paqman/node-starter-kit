/**
 * Execute a search
 * @param  {[type]}   request
 * @param  {[type]}   response
 * @param  {Function} next
 * @return {[type]}
 */
app.get('/s/search', function (request, response, next) {
  response.send({result : true});
});