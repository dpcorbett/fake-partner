/* global window, angular */

window.app = angular.module('FakePartnerApp', [
  'ui.router',
  'angular-flash.service',
  'angular-flash.flash-alert-directive',
  'ui.select2',
  'mm.foundation',
  'mgo-angular-wizard',
  'rt.eventemitter'
])
.constant('lodash', window._)
.run(['$state', '$http', 'Socket', 'clientId', 'clientSecret', fakePosRun]);

// Load some constants into ng
['primusUrl', 'clientId', 'clientSecret', 'meerkatHost', 'apiVersion', 'websocketUrl'].forEach(function(v){
  angular.module('FakePartnerApp').constant(v, window[v]);
});


function fakePosRun($state, $http, Socket, clientId, clientSecret){
  //Set Authorization header
  $http.defaults.headers.common.Authorization = 'Basic ' + btoa(clientId + ':' + clientSecret);

  // Initialize the Socket
  Socket.init();

  // Navigate to the landing page
  $state.go('partner.home');
}
