angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', 'flash', 'Meerkat', 'WizardHandler', 'doshiiEmitter', PartnerCtrl ]);

function PartnerCtrl($scope, flash, Meerkat, WizardHandler, doshiiEmitter) {
  console.log('loaded partner ctrl');
  Meerkat.getLocations();

  $scope.locations = Meerkat.data.locations;
  $scope.Meerkat = Meerkat;

  $scope.order = {};
  $scope.tableOrders = [];
  $scope.selectedLocation = {id: null};
  $scope.selectedTable = {name: null};
    $scope.selectedTab = 'pay-at-table';
    $scope.itemPosId = "34";
    $scope.varientId = "35";

  $scope.orderPayload = {
    "type": "pickup",
    "surcounts": [],
    "items": [
      {
        "name": "Pepperoni Pizza",
        "description": "Yum",
        "unitPrice": '1000',
        "totalBeforeSurcounts": '1000',
        "totalAfterSurcounts": '1000',
        "posId": "",
        "surcounts": [],
        "options": [],
        "quantity": 1
      }
    ]
  };
    
  $scope.setPosId = function(posId) {
        $scope.itemPosId = posId;
  }  
    
  function setVarientId(varientId) {
      $scope.varientId = varientId;
  }  

  $scope.formattedOrder = () => JSON.stringify($scope.orderPayload, undefined, 2);

  $scope.selectTab = function(tabName) {
    $scope.selectedTab = tabName;
  };
    
    $scope.makeDelivery = function (posid, varientId) {
        $scope.orderPayload = {
            "type": "delivery",
            "surcounts": [],
            "items": [
                {
                    "name": "Pepperoni Pizza",
                    "description": "Yum",
                    "unitPrice": '1000',
                    "totalBeforeSurcounts": '1000',
                    "totalAfterSurcounts": '1000',
                    "posId": $scope.itemPosId,
                    "surcounts": [],
                    "options": [],
                    "quantity": 1
                }
            ]
        };
    };
    
    $scope.makePickup = function (posId, varientId) {
        $scope.orderPayload = {
            "type": "pickup",
            "surcounts": [],
            "items": [
                {
                    "name": "Pepperoni Pizza",
                    "description": "Yum",
                    "unitPrice": '1000',
                    "totalBeforeSurcounts": '1000',
                    "totalAfterSurcounts": '1000',
                    "posId": $scope.itemPosId,
                    "surcounts": [],
                    "options": [],
                    "quantity": 1
                }
            ]
        };
    };  
    
    $scope.addSurcount = function (posId, varientId) {
        $scope.orderPayload = {
            "type": "pickup",
            "surcounts": [],
            "items": [
                {
                    "name": "Pepperoni Pizza",
                    "description": "Yum",
                    "unitPrice": '1000',
                    "totalBeforeSurcounts": '1000',
                    "totalAfterSurcounts": '1000',
                    "posId": $scope.itemPosId,
                    "surcounts": [],
                    "options": [],
                    "quantity": 1
                }
            ]
        };
    };

    $scope.addOptions = function (posid, varientId) {
        $scope.orderPayload = {
            "type": "pickup",
            "surcounts": [],
            "items": [
                {
                    "name": "Pepperoni Pizza",
                    "description": "Yum",
                    "unitPrice": '1000',
                    "totalBeforeSurcounts": '1000',
                    "totalAfterSurcounts": '1000',
                    "posId": $scope.itemPosId,
                    "surcounts": [],
                    "options": [],
                    "quantity": 1
                }
            ]
        };
    };

  $scope.getLocations = Meerkat.getLocations;
  $scope.startOver = () => WizardHandler.wizard().goTo(0);

  $scope.selectLocationAndGo = (locId) => {
    $scope.selectedLocation.id = locId;
    WizardHandler.wizard().next();
  };

  doshiiEmitter.on('order_updated', updateOrder);
  doshiiEmitter.on('transaction_updated', updateTransaction);

  function updateOrder(event) {
    if(event.orderId === $scope.order.id) {
      Meerkat.getOrder($scope.order.id).then(res => $scope.order = res.data)
    }
  }

  function updateTransaction(event) {
    Meerkat.updateTransaction(event.uri);
  }
    
  $scope.fetchTableAndGo = () => {
    Meerkat.getOrdersForTable($scope.selectedTable.name, $scope.selectedLocation.id)
      .then(res => {
        $scope.tableOrders.length = 0;
        Array.prototype.push.apply($scope.tableOrders, res.data);

        if($scope.tableOrders.length > 0) {
          WizardHandler.wizard().next();
        } else {
          flash.error = 'No orders on table ' + $scope.selectedTable.name;
        }
      });
  };

  $scope.sendOrderAndGo = () => {
    Meerkat.sendOrder(JSON.stringify($scope.orderPayload), $scope.selectedLocation.id)
      .then(res => {
        //$scope.tableOrders.length = 0;
        //Array.prototype.push.apply($scope.tableOrders, res.data);

        //if(true) {
          WizardHandler.wizard().next();
        //} else {
        //  flash.error = 'No orders on table ' + $scope.selectedTable.name;
        //}
      });
  };

  $scope.getOrderAndGo = orderId => Meerkat.getOrder(orderId)
    .then(res => {
      $scope.order = res.data;

      if ($scope.order.id) {
        WizardHandler.wizard().next();
      }
    });

  $scope.addPayments = () => {

    Meerkat.addPayment($scope.order)
      .then(() => WizardHandler.wizard().next());
  };

  $scope.complete = () => {
    Meerkat.complete(Meerkat.data.pendingTransactions[0])
      .then(() => {
        $scope.startOver();
        flash.success = 'Transaction completed successfully';
        $scope.order = {};
      });
  };
}
