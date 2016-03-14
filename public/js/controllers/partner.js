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
    $scope.itemPosId = "";
    $scope.itemPrice = "1000";
    $scope.varientId = "";
    $scope.varientPrice = "200";
    $scope.includeTransaction = false;
    $scope.includeVarient = false;
    $scope.orderType = 'pickup';
    $scope.includeOrderSurcount = false;
    $scope.includeItemSurcount = false;
    $scope.orderSurcountPosId = "";
    $scope.orderSurcountPrice = "100";
    $scope.itemSurcountPosId = "";
    $scope.itemSurcountPrice = "100";
    $scope.orderSurcountJson = [];
    $scope.itemSurcountJson = [];
    $scope.itemPriceAfterSurcount = "0";
    $scope.itemPriceBeforeSurcount = "0";
    $scope.itemOptionjson = [];
    $scope.transactionjson = "";
    $scope.orderTotal = "0";
    
    
  $scope.orderPayload = {
    "type": "pickup",
    "surcounts": $scope.orderSurcountJson,
    "items": [
      {
        "name": "Pepperoni Pizza",
        "description": "Yum",
        "unitPrice": $scope.itemPrice,
        "totalBeforeSurcounts": '1000',
        "totalAfterSurcounts": '1000',
        "posId": $scope.itemPosId,
        "surcounts": $scope.itemSurcountJson,
        "options": [],
        "quantity": 1
      }
    ]
};

    function generateOrderSurcount() {
        if ($scope.includeOrderSurcount) {
            $scope.orderSurcountJson = [
                {
                    "posId": $scope.orderSurcountPosId,
                    "name": "order surcount",
                    "price": $scope.orderSurcountPrice
                }
            ];
        } else {
            $scope.orderSurcountJson = [];
        }
    }
    
    function generateItemSurcount() {
        if ($scope.includeItemSurcount) {
            $scope.itemSurcountJson = [
                {
                    "posId": $scope.itemSurcountPosId,
                    "name": "item surcount",
                    "price": $scope.itemSurcountPrice
                }
            ];
        } else {
            $scope.orderSurcountJson = [];
        }
    }
    
    function generateItemOptions() {
        if ($scope.includeVarient) {
            $scope.itemOptionJson = [
                {
                    "posId": "Pos Option List",
                    "name": "Pos Option List",
                    "variants": [
                    {
                        "posId" : $scope.varientId,
                        "name" : "item varient",
                        "price" : $scope.varientPrice
                    }]
                }
            ];
        } else {
            $scope.itemOptionJson = [];
        }
    }
    
    function generateItemPriceBeforeSurcount() {
        if ($scope.includeVarient) {
            $scope.itemPriceBeforeSurcount = (parseInt($scope.itemPrice) + parseInt($scope.varientPrice)).toString();
        } else {
            $scope.itemPriceBeforeSurcount = $scope.itemPrice;
        }
    }
    
    function generateItemPriceAfterSurcount() {
        generateItemPriceBeforeSurcount();
        if ($scope.includeItemSurcount) {
            $scope.itemPriceAfterSurcount = (parseInt($scope.itemPriceBeforeSurcount) + parseInt($scope.itemSurcountPrice)).toString();
        } else {
            $scope.itemPriceAfterSurcount = $scope.itemPriceBeforeSurcount;
        }
    }
    
    function generateOrderTotal() {
        generateItemPriceAfterSurcount();
        if ($scope.includeOrderSurcount) {
            $scope.orderTotal = (parseInt($scope.itemPriceAfterSurcount) + parseInt($scope.orderSurcountPrice)).toString();
        } else {
            $scope.orderTotal = $scope.itemPriceAfterSurcount;
        }
    }
    
    function generateTransactionJson() {
        generateOrderTotal();
        if ($scope.includeTransaction) {
            $scope.transactionjson = [
                {
                    "amount": $scope.orderTotal,
                    "prepaid": true,
                    "invoice": "inv0101010"
                }
            ];
        } else {
            $scope.transactionjson = [];
        }
    }

    $scope.setPosId = function(posId) {
        $scope.itemPosId = posId;
    }
    
    $scope.setItemPrice = function (itemPrice) {
        $scope.itemPrice = itemPrice;
    }  
    
    $scope.setVarientId = function(varientId) {
        $scope.varientId = varientId;
    }  
    
    $scope.setVarientPrice = function (varientPrice) {
        $scope.varientPrice = varientPrice;
    }
    
    $scope.setOrderSurcountPosId = function (orderSurcountPosId) {
        $scope.orderSurcountPosId = orderSurcountPosId;
    }
    
    $scope.setOrderSurcountPrice = function (orderSurcountPrice) {
        $scope.orderSurcountPrice = orderSurcountPrice;
    }
    
    $scope.setItemSurcountPosId = function (itemSurcountPosId) {
        $scope.itemSurcountPosId = itemSurcountPosId;
    }
    
    $scope.setItemSurcountPrice = function (itemSurcountPrice) {
        $scope.itemSurcountPrice = itemSurcountPrice;
    }
    
    $scope.setIncludeTransaction = function (includeTransaction) {
        $scope.includeTransaction = includeTransaction;
    }
    
    $scope.setIncludeItemSurcount = function (includeItemSurcount) {
        $scope.includeItemSurcount = includeItemSurcount;
    }
    
    $scope.setIncludeOrderSurcount = function (includeOrderSurcount) {
        $scope.includeOrderSurcount = includeOrderSurcount;
    }
    
    $scope.setIncludeVarient = function (includeVarient) {
        $scope.includeVarient = includeVarient;
    }
    
    $scope.setOrderType = function (type) {
        $scope.orderType = type;
    }  
    
    $scope.formattedOrder = () => JSON.stringify($scope.orderPayload, undefined, 2)    ;

    $scope.selectTab = function(tabName) {
        $scope.selectedTab = tabName;
    };
    
    $scope.makeDelivery = function () {
        generateOrderSurcount();
        generateItemSurcount();
        generateItemPriceAfterSurcount();
        generateItemOptions();
        generateTransactionJson();
        $scope.orderPayload = {
            "Consumer" : {
                "name" : "john Doe",
                "phoneNumber" : "0404040404",
                "addressLine1" : "616 St Kilda Road",
                "addressLine2" : "2/8",
                "city" : "Melbourne",
                "state" : "victoria",
                "postalCode" : "3003",
                "country" : "Australia",
                "notes" : "some notes for the order"
            },
            "transactions" : $scope.transactionjson,
            "order" : {
                "type": $scope.orderType,
                "surcounts": $scope.orderSurcountJson,
                "items": [
                    {
                        "name": "Pepperoni Pizza",
                        "description": "Yum",
                        "unitPrice": $scope.itemPrice,
                        "totalBeforeSurcounts": $scope.itemPriceBeforeSurcount,
                        "totalAfterSurcounts": $scope.itemPriceAfterSurcount,
                        "posId": $scope.itemPosId,
                        "surcounts": $scope.itemSurcountJson,
                        "options": $scope.itemOptionJson,
                        "quantity": 1
                    }
                ]
            }
        };
    };
    
    $scope.makePickup = function () {
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
    
    $scope.addSurcount = function () {
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
                    "surcounts": [{
                            "name": "Free Item",
                            "amount": "-100",
                            "type": "percentage"
                        }],
                    "options": [],
                    "quantity": 1
                }
            ]
        };
    };

    $scope.addOptions = function () {
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
