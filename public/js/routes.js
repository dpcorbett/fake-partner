angular
  .module('FakePOSApp')
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
    $stateProvider.state('pos', {
      url: '/pos',
      abstract: true,
      template: '<ui-view/>'
    });

    $stateProvider.state('pos.home', {
      url: '/home',
      templateUrl: 'partials/pos/index.html',
      controller: 'PosCtrl'
    });

    $stateProvider.state('pos.products', {
      url: '/products',
      templateUrl: 'partials/pos/products.html',
      controller: 'PosProductsCtrl'
    });

    $stateProvider.state('pos.createOrder', {
      url: '/create-order',
      templateUrl: 'partials/pos/createOrder.html',
      controller: 'PosCreateOrderCtrl'
    });

    $stateProvider.state('pos.partnerPayOrder', {
      url: '/partner-pay-order/:orderId',
      templateUrl: 'partials/pos/partnerPayOrder.html',
      controller: 'PosPartnerPayOrderCtrl'
    });

    $stateProvider.state('pos.config', {
      url: '/config',
      templateUrl: 'partials/pos/config.html',
      controller: 'PosConfigCtrl'
    });
  }]);
