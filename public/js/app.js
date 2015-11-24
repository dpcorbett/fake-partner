/* global window, angular */

window.app = angular.module('FakePartnerApp', [
  'ui.router',
  'angular-flash.service',
  'angular-flash.flash-alert-directive',
  'primus',
  'ui.select2',
  'mm.foundation',
  'mgo-angular-wizard'
])
.constant('lodash', window._)
.run(['$http', 'Socket', 'clientId', 'clientSecret', fakePosRun]);

// Load some constants into ng
['primusUrl', 'clientId', 'clientSecret', 'meerkatHost', 'apiVersion', 'websocketUrl'].forEach(function(v){
  angular.module('FakePartnerApp').constant(v, window[v]);
});


function fakePosRun($http, Socket, clientId, clientSecret){
  //Set Authorization header
  $http.defaults.headers.common.Authorization = 'Basic ' + btoa(clientId + ':' + clientSecret);

  // Initialize the Socket
  Socket.init();
}
