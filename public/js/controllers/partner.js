angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', 'flash', 'Meerkat', 'WizardHandler', 'doshiiEmitter', PartnerCtrl ]);

function PartnerCtrl($scope, flash, Meerkat, WizardHandler, doshiiEmitter) {
  console.log('loaded partner ctrl');
  Meerkat.getLocations();

  $scope.locations = Meerkat.data.locations;
  $scope.products = Meerkat.data.products;
  $scope.surcounts = Meerkat.data.surcounts;
  $scope.Meerkat = Meerkat;

  $scope.order = {};
  $scope.tableOrders = [];
  $scope.selectedLocation = {id: null};
  $scope.selectedTable = {name: null};
    $scope.selectedTab = 'pay-at-table';
    $scope.itemPosId = undefined;
    $scope.itemPrice = "1000";
    $scope.optionsListId = "Pos Option List Id";
    $scope.optionsListName = "Pos Option List Name";
    $scope.varientId = undefined;
    $scope.varientPrice = "200";
    $scope.includeTransaction = false;
    $scope.includeVarient = false;
    $scope.orderType = 'pickup';
    $scope.includeOrderSurcount = false;
    $scope.includeItemSurcount = false;
    $scope.orderSurcountPosId = undefined;
    $scope.orderSurcountPrice = "100";
    $scope.itemSurcountPosId = undefined;
    $scope.itemSurcountPrice = "100";
    $scope.orderSurcountJson = [];
    $scope.itemSurcountJson = [];
    $scope.itemPriceAfterSurcount = "0";
    $scope.itemPriceBeforeSurcount = "0";
    $scope.itemOptionjson = [];
    $scope.payFullAmount = true;
    $scope.transactionTotal = 0;
    $scope.transacitonInvoice = "Inv010101";
    $scope.consumerName = "John Doe";
    $scope.consumerPhoneNumber = "0404040404";
    $scope.consumerAddressLine1 = "616 St Kilda Road";
    $scope.consumerAddressLine2 = "2/8";
    $scope.consumerCity = "Melbourne";
    $scope.consumerState = "Victoria";
    $scope.consumerPostalCode = "3004";
    $scope.consumerNotes = "some notes to test";
    $scope.orderRequiredAt = undefined;
    $scope.varientName = "item varient";
    $scope.itemName = "Pepperoni Pizza";
    $scope.itemQuantity = "1";
    $scope.manualPaymentTotal = 0;
    
    $scope.orderTotal = "0";

    $scope.orderPayload = "";
    $scope.transactionPayload = "";
    $scope.consumerPayload = "";

    function generateOrderSurcount() {
        if ($scope.includeOrderSurcount) {
            $scope.orderSurcountJson = [
                {
                    "posId": $scope.orderSurcountPosId,
                    "name": "order surcount",
                    "amount": $scope.orderSurcountPrice,
                    "type" : "absolute"
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
                    "amount": $scope.itemSurcountPrice,
                    "type" : "absolute"
                }
            ];
        } else {
            $scope.itemSurcountJson = [];
        }
    }
    
    function generateItemOptions() {
        if ($scope.includeVarient) {
            $scope.itemOptionJson = [
                {
                    "posId": $scope.optionsListId,
                    "name": $scope.optionsListName,
                    "variants": [
                    {
                        "posId" : $scope.varientId,
                        "name" : $scope.varientName,
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
            $scope.itemPriceBeforeSurcount = (parseInt($scope.itemPrice) * parseInt($scope.itemQuantity) + parseInt($scope.varientPrice) * parseInt($scope.itemQuantity)).toString();
        } else {
            $scope.itemPriceBeforeSurcount = $scope.itemPrice * parseInt($scope.itemQuantity);
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
        if ($scope.payFullAmount) {
            $scope.transactionTotal = parseInt($scope.orderTotal).toString();
        } else {
            $scope.transactionTotal = (parseInt($scope.orderTotal) / 2).toString();
        }
    }
    
    function calculateOrderDetails() {
        generateOrderSurcount();
        generateItemSurcount();
        generateItemPriceAfterSurcount();
        generateItemOptions();
        generateOrderTotal();
    }
    
    function generateConsumerJson() {
        $scope.consumerPayload = {
            "name" : $scope.consumerName,
            "phoneNumber" : $scope.consumerPhoneNumber,
            "addressLine1" : $scope.consumerAddressLine1,
            "addressLine2" : $scope.consumerAddressLine2,
            "city" : $scope.consumerCity,
            "state" : $scope.consumerState,
            "postalCode" : $scope.consumerPostalCode,
            "country" : "AU",
            "notes" : $scope.consumerNotes
        }
    }
    
    function generateTransactionJson() {
        generateOrderTotal();
        if ($scope.manualPaymentTotal) {
            $scope.transactionPayload = [
                {
                    "amount": parseInt($scope.manualPaymentTotal).toString(),
                    "prepaid": true,
                    "invoice": $scope.transacitonInvoice
                }
            ];
        } else {
            if ($scope.includeTransaction) {
                $scope.transactionPayload = [
                    {
                        "amount": $scope.transactionTotal,
                        "prepaid": true,
                        "invoice": $scope.transacitonInvoice
                    }
                ];
            } else {
                $scope.transactionPayload = [];
            }
        }
    }

    function generateOrderJson() {
        $scope.orderPayload = {
            "type": $scope.orderType,
            "surcounts": $scope.orderSurcountJson,
            "requiredAt" : $scope.orderRequiredAt,
            "items": [
                {
                    "name": $scope.itemName,
                    "description": "Yum",
                    "unitPrice": $scope.itemPrice,
                    "totalBeforeSurcounts": $scope.itemPriceBeforeSurcount,
                    "totalAfterSurcounts": $scope.itemPriceAfterSurcount,
                    "posId": $scope.itemPosId,
                    "surcounts": $scope.itemSurcountJson,
                    "options": $scope.itemOptionJson,
                    "quantity": $scope.itemQuantity
                    
                }
            ]
        }
    }
    
    function setOrderJson() {
        calculateOrderDetails();
        generateOrderJson();
        generateConsumerJson();
        generateTransactionJson();
    }

    setOrderJson();
    
    $scope.setPosId = function (posId) {
        if (posId) {
            $scope.itemPosId = posId;
        } else {
            $scope.itemPosId = undefined;
        }
        setOrderJson();
    }
    
    $scope.setOrderRequiredAt = function (requiredAt) {
        if (requiredAt) {
            $scope.orderRequiredAt = requiredAt;
        } else {
            $scope.orderRequiredAt = undefined;
        }
        setOrderJson();
    }
    
    $scope.setItemPrice = function (itemPrice) {
        $scope.itemPrice = itemPrice;
        setOrderJson();
    }
    
    $scope.setitemQuantity = function (itemQuantity) {
        $scope.itemQuantity = itemQuantity;
        setOrderJson();
    }
    
    
    $scope.setItemName = function (itemName) {
        $scope.itemName = itemName;
        setOrderJson();
    }
    
    $scope.setVarientName = function (varientPrice) {
        $scope.varientName = varientPrice;
        setOrderJson();
    }  
    
    $scope.setVarientId = function(newVarientId) {
        if (newVarientId) {
            $scope.varientId = newVarientId;
        } else {
            $scope.varientId = undefined;
        }
        setOrderJson();
    }
    
    $scope.setOptionListId = function (newOptionListId) {
        if (newOptionListId) {
            $scope.optionsListId = newOptionListId;
        } else {
            $scope.optionsListId = "Pos Option List Id";
        }
        setOrderJson();
    }
    
    $scope.setOptionsListName = function (newOptionListName) {
        if (newOptionListName) {
            $scope.optionsListName = newOptionListName;
        } else {
            $scope.optionsListName = "Pos Option List Name";
        }
        setOrderJson();
    }  
    
    $scope.setVarientPrice = function (varientPrice) {
        $scope.varientPrice = varientPrice;
        setOrderJson();
    }
    
    $scope.setOrderSurcountPosId = function (orderSurcountPosId) {
        if (orderSurcountPosId) {
            $scope.orderSurcountPosId = orderSurcountPosId;
        } else {
            $scope.orderSurcountPosId = undefined;
        }
        setOrderJson();
    }
    
    $scope.setOrderSurcountPrice = function (orderSurcountPrice) {
        $scope.orderSurcountPrice = orderSurcountPrice;
        setOrderJson();
    }
    
    $scope.setItemSurcountPosId = function (itemSurcountPosId) {
        if (itemSurcountPosId) {
            $scope.itemSurcountPosId = itemSurcountPosId;
        } else {
            $scope.itemSurcountPosId = undefined;
        }
        setOrderJson();
    }
    
    $scope.setItemSurcountPrice = function (itemSurcountPrice) {
        $scope.itemSurcountPrice = itemSurcountPrice;
        setOrderJson();
    }
    
    $scope.setIncludeTransaction = function (includeTransaction) {
        $scope.includeTransaction = includeTransaction;
        setOrderJson();
    }
    
    $scope.setIncludeItemSurcount = function (includeItemSurcount) {
        $scope.includeItemSurcount = includeItemSurcount;
        setOrderJson();
    }
    
    $scope.setIncludeOrderSurcount = function (includeOrderSurcount) {
        $scope.includeOrderSurcount = includeOrderSurcount;
        setOrderJson();
    }
    
    $scope.setIncludeVarient = function (includeVarient) {
        $scope.includeVarient = includeVarient;
        setOrderJson();
    }
    
    $scope.setOrderType = function (type) {
        $scope.orderType = type;
        setOrderJson();
    }  
    
    $scope.setPayFullAmount = function(shouldPayAll) {
        $scope.payFullAmount = shouldPayAll;
        setOrderJson();
    }
    
    $scope.setTransactionInvoice = function (invoiceString) {
        $scope.transacitonInvoice = invoiceString;
        setOrderJson();
    }
    
    $scope.setConsumerName = function (nameString) {
        $scope.consumerName = nameString;
        setOrderJson();
    }
    
    $scope.setConsumerPhoneNumber = function (phoneNumberString) {
        $scope.consumerPhoneNumber = phoneNumberString;
        setOrderJson();
    }
    
    $scope.setConsumerAddressLine1 = function (invoiceString) {
        $scope.consumerAddressLine1 = invoiceString;
        setOrderJson();
    }
    
    $scope.setConsumerAddressLine2 = function (invoiceString) {
        $scope.consumerAddressLine2 = invoiceString;
        setOrderJson();
    }
    
    $scope.setConsumerCity = function (invoiceString) {
        $scope.consumerCity = invoiceString;
        setOrderJson();
    }
    
    $scope.setConsumerState = function (invoiceString) {
        $scope.consumerState = invoiceString;
        setOrderJson();
    }
    
    $scope.setConsumerPostalCode = function (invoiceString) {
        $scope.consumerPostalCode = invoiceString;
        setOrderJson();
    }
    
    $scope.setConsumerNotes = function (invoiceString) {
        $scope.consumerNotes = invoiceString;
        setOrderJson();
    }

    $scope.generateOrder = function() {
        setOrderJson();
    }
    
    $scope.setManualPaymentTotal = function (manualPaymentAmount) {
        $scope.manualPaymentTotal = manualPaymentAmount;
        setOrderJson();
    }

    $scope.formattedOrder = () => JSON.stringify($scope.orderPayload, undefined, 2);
    $scope.formattedTransaction = () => JSON.stringify($scope.transactionPayload, undefined, 2);
    $scope.formattedConsumer = () => JSON.stringify($scope.consumerPayload, undefined, 2);


    $scope.formattedJsonToSend = () => {
        var sendBody = {};
        sendBody.consumer = $scope.consumerPayload;
        sendBody.transactions = $scope.transactionPayload;
        sendBody.order = $scope.orderPayload;

        return JSON.stringify(sendBody, undefined, 2);

    };
    
    $scope.selectTab = function (tabName) {
        $scope.selectedTab = tabName;
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

$scope.getMenu = () => {
    Meerkat.getMenu($scope.selectedLocation.id);
};

  $scope.sendOrderAndGo = () => {
    Meerkat.sendOrder($scope.formattedJsonToSend(), $scope.selectedLocation.id)
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
