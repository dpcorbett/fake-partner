/* global window, angular */

window.app = angular.module('FakePOSApp', [
  'ui.router',
  'angular-flash.service',
  'angular-flash.flash-alert-directive',
  'primus',
  'ui.select2',
  'mm.foundation',
  'mgo-angular-wizard'
])
.config(['$urlRouterProvider', 'primusProvider',  function($urlRouterProvider, primusProvider) {
  primusProvider
  // Define Primus endpoint.
  .setEndpoint(window.meerkatHost + 'socket?token=' + window.token)
  // Define Primus options.
  .setOptions({
    reconnect: {
      minDelay: 100,
      maxDelay: 60000,
      retries: 100
    }
  })
  // Define default multiplex option for resources.
  .setDefaultMultiplex(false);

  $urlRouterProvider.otherwise('/');
}])
.value('getMeerkatHost', function getValue(){
  var host = window.meerkatHost;
  return host;
})
.constant('lodash', window._)
.run(['$http', 'Socket', 'token', 'primusUrl', fakePosRun]);

// Load some constants into ng
['meerkatHost', 'token', 'primusUrl', 'apiVersion'].forEach(function(v){
  angular.module('FakePOSApp').constant(v, window[v]);
});


function fakePosRun($http, Socket, token, primusUrl){
  var auth = {
    token: token,
    url: primusUrl
  };

  // Set Authorization header
  $http.defaults.headers.common.Authorization = auth.token;

  // Initialize the Socket
  Socket.init(auth);
}
