angular
  .module('FakePartnerApp')
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
    $stateProvider.state('partner', {
      url: '/partner',
      abstract: true,
      template: '<ui-view/>'
    });

    $stateProvider.state('partner.home', {
      url: '/home',
      templateUrl: 'partials/partner/index.html',
      controller: 'PartnerCtrl'
    });

    $stateProvider.state('partner.table', {
      url: '/table',
      templateUrl: 'partials/partner/table.html',
      controller: 'TableCtrl'
    });
  }]);
