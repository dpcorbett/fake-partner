/* global app */

app.factory('middleware', ['apiVersion', 'meerkatHost', function(apiVersion, getMeerkatHost) {
  return {
    request: function(config) {

      // loading of partial templates
      if (config.url.indexOf('.html') > -1 || config.url.match(/^http/)) {
        return config;
      }

      // need more controlling when there is more than 1 domain involved
      config.url = meerkatHost + config.url;
      return config;
    }
  };
}]);


app.config(["$httpProvider", function($httpProvider) {
  $httpProvider.interceptors.push('middleware');
}]);
