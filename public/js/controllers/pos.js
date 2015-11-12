angular
  .module('FakePOSApp')
  .controller('PosCtrl', [ '$scope', 'Meerkat', 'OrderHelper', PosCtrl ])
  .controller('PosProductsCtrl', ['$scope', 'Meerkat', PosProductsCtrl])
  .controller('PosConfigCtrl', ['$scope', 'Meerkat', 'flash', PosConfigCtrl])
  .controller('PosCreateOrderCtrl', ['$scope', '$state', 'Meerkat', PosCreateOrderCtrl])
  .controller('PosPartnerPayOrderCtrl',
    ['$scope', '$q', '$stateParams', '$state', 'Meerkat', 'lodash', 'Socket', PosPartnerPayOrderCtrl]);

function PosCtrl($scope, Meerkat, OrderHelper) {

  $scope.Meerkat = Meerkat;
  $scope.OrderHelper = OrderHelper;
  $scope.checkoutConsumer = true;
  $scope.deallocateTable = true;

  $scope.getConsumers = () => {
    Meerkat.getConsumers()
      .then(() => $scope.consumers = Meerkat.data.consumers);
  };

  $scope.getTableAllocations = () => {
    Meerkat.getTableAllocations()
      .then(() => $scope.tableAllocations = Meerkat.data.table_allocations);
  };

  $scope.getOrders = () => {
    Meerkat.getOrders()
      .then(() => $scope.orders = Meerkat.data.orders);
  };

  $scope.addPayment = order => {
    Meerkat.addPayment(order, $scope.deallocateTable, $scope.checkoutConsumer);
  };

  $scope.getConfig = () => Meerkat.getConfig();

  setTimeout(() => {
    $scope.getConsumers();
    $scope.getTableAllocations();
    $scope.getOrders();
    $scope.getConfig();
  }, 200);

}

function PosConfigCtrl($scope, Meerkat, flash) {
  $scope.config = Meerkat.data.config;
  $scope.formattedConfig = () => JSON.stringify($scope.config, undefined, 2);

  $scope.sendConfig = () => Meerkat.sendConfig($scope.config)
    .then(res => flash.success = 'Config updated successfully')
    .catch(err => flash.error = 'Config update failed: ' + err.data.details[0].message);
}

function PosProductsCtrl($scope, Meerkat) {
  $scope.products = '';
  $scope.loadProducts = () => Meerkat.sendProducts($scope.products);
}

function PosCreateOrderCtrl($scope, $state, Meerkat) {
  $scope.orderMeta = {
    id: Math.random().toString(36).substring(2, 8),
    includeTableAllocation: true
  };
  $scope.table = { name: '11', status: 'confirmed' };
  $scope.order = {
    status: 'accepted',
    surcounts: [],
    payments: [],
    items: [
      {
        "pos_id": "20",
        "name": "Steak",
        "description": "A beautiful porterhouse.",
        "status": "pending",
        "price": "1200",
        "selectedForPayment": true,
        "tags": ["Lunch", "Dinner"],
        "additional_instructions": "Please add extra salt!",
        "product_options": [
          {
            pos_id: 'cooking_pos',
            "name": "Cooking type ?",
            "min": 1,
            "max": 1,
            "variants": [
              {"name": "Rare", "pos_id": "rare"},
              {"name": "Medium Rare", "pos_id": "medium_rare"},
              {"name": "Medium", "pos_id": "medium"},
              {"name": "Well done", "pos_id": "well_done"}
            ],
            "selected": [{pos_id: "medium_rare", name: "medium rare"}]
          },
          {
            pos_id: 'sauce_pos',
            "name": "Sauce",
            "min": 0,
            "max": 1,
            "variants": [
              {
                "name": "Mushroom",
                "price": 20,
                "pos_id": "mushroom"
              },
              {
                "name": "Pepper Corn",
                "price": 120,
                "pos_id": "pepper_corn"
              }
            ],
            "selected": []
          },
          {
            pos_id: 'extras_pos',
            "name": "Extras",
            "min": 0,
            "variants": [
              {
                "name": "Bacon",
                "price": 0200,
                "pos_id": "bacon"
              },
              {
                "name": "Pickles",
                "price": 0200,
                "pos_id": "pickles"
              }
            ],
            "selected": [{pos_id: "bacon", name: "bacon", price: "0200"}, {
              pos_id: "pickles",
              name: "pickles",
              price: "0200"
            }]
          }
        ]
      }
    ]
  };

  $scope.goHome = () => $state.go('pos.home');
  $scope.formattedTable = () => JSON.stringify($scope.table, undefined, 2);
  $scope.formattedOrder = () => JSON.stringify($scope.order, undefined, 2);

  $scope.orderPostBody = () => {
    var body = $scope.orderMeta.includeTableAllocation
      ? {table: $scope.table, order: $scope.order}
      : {order: $scope.order};

    return JSON.stringify(body, undefined, 2)
  };


  $scope.sendOrder = () => Meerkat.createOrder($scope.orderMeta.id, $scope.orderPostBody())
      .then(order => $scope.sentOrder = order);
}

function PosPartnerPayOrderCtrl($scope, $q, $stateParams, $state, Meerkat, _, Socket) {
  $scope.orderId = $stateParams.orderId;
  $scope.order = () => _.find(Meerkat.data.orders, {id: $stateParams.orderId});

  $scope.updatedOrder = {status: 'waiting for payment'};

  $scope.statusFunctions = {
    'waiting for payment': () => {
      // we don't want to delay the transition by returning this pending promise
      Meerkat.waitForPayment($scope.order())
        .catch(() => $scope.updatedOrderStatus = 'accepted');

      var deferred = $q.defer();
      deferred.resolve(true);
      return deferred.promise;
    },
    'accepted': () => Meerkat.acceptOrder($scope.order()).then(() => true),
    'paid': () => Meerkat.addPayment($scope.order()).then(() => true)
  };

  $scope.wfpDisabled = () => $scope.updatedOrder.status !== 'waiting for payment';
  $scope.paidDisabled = () => $scope.updatedOrder.status !== 'paid';
  $scope.acceptedDisabled = () => $scope.updatedOrder.status !== 'accepted';

  Socket.init().$on('order_status', function(data) {
    if($scope.orderId === data.orderId) {
      $scope.updatedOrderStatus = data.status;
    }
  });

  $scope.accepted = () => $scope.updatedOrderStatus === 'accepted';
  $scope.paid = () => $scope.updatedOrderStatus === 'paid';


  $scope.goHome = () => {
    if ($scope.accepted() || $scope.paid()) {
      $state.go('pos.home')
    }
  };
}
