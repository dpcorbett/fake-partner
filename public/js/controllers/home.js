angular
  .module('FakePartnerApp')
  .config(['$stateProvider',  function($stateProvider)  {
    $stateProvider.state('root', {
      url: '/',
      templateUrl: 'partials/home/index.html',
      controller: 'HomeCtrl'
    });
  }])
  .controller('HomeCtrl', ['$scope', '$state', 'Socket', function($scope, $state, Socket) {
    console.log('loaded home ctrl');
  }]);
