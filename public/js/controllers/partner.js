angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', 'flash', 'Meerkat', 'WizardHandler', 'doshiiEmitter', PartnerCtrl ]);

function PartnerCtrl($scope, flash, Meerkat, WizardHandler, doshiiEmitter) {
  console.log('loaded partner ctrl');
  Meerkat.getLocations();


    $scope.acceptRewardsRedemptions = false;
    $scope.acceptPointsRedemptions = false;
  $scope.locations = Meerkat.data.locations;
  $scope.products = Meerkat.data.products;
    $scope.surcounts = Meerkat.data.surcounts;
    $scope.members = Meerkat.data.members;
  $scope.Meerkat = Meerkat;

  $scope.order = {};
  $scope.tableOrders = [];
  $scope.selectedLocation = { id: null };
  $scope.selectedOrginisation = { id: null };
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
    $scope.orderSurcountIsPercentage = false;
    $scope.includeItemSurcount = false;
    $scope.orderSurcountPosId = undefined;
    $scope.orderSurcountAmount = "100";
    $scope.orderSurcountValue = "100";
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
    $scope.consumerEmail = "testEmail@test.com.au";
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
    $scope.newMemberName = "John Doe";
    $scope.newMemberEmail = "JohnDoe@test.com.au";
    $scope.newMemberPhone = "0231658974";
    $scope.newMemberPoints = 100;
    $scope.newMemberAddressLine1 = "34 Member Street";
    $scope.newMemberAddressLine2 = undefined;
    $scope.newMemberCity = "Melbourne";
    $scope.newMemberState = "Vic";
    $scope.newMemberPostalCode = "3000";
    $scope.newMemberCountry = "Au";
    $scope.newMemberJson = "";
    $scope.tipsAmount = 100;
    $scope.includeTips = false;


    function generateOrderSurcount() {
        if ($scope.includeOrderSurcount) {
            if ($scope.orderSurcountIsPercentage) {
                $scope.orderSurcountJson = [
                    {
                        "posId": $scope.orderSurcountPosId,
                        "name": "order surcount",
                        "amount": $scope.orderSurcountAmount,
                        "value": $scope.orderSurcountValue,
                        "type" : "percentage"
                    }
                ];
            } else {
                $scope.orderSurcountJson = [
                    {
                        "posId": $scope.orderSurcountPosId,
                        "name": "order surcount",
                        "amount": $scope.orderSurcountAmount,
                        "value": $scope.orderSurcountValue,
                        "type" : "absolute"
                    }
                ];
            }
            
            
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
            $scope.orderTotal = (parseInt($scope.itemPriceAfterSurcount) + parseInt($scope.orderSurcountValue)).toString();
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
            "phone" : $scope.consumerPhoneNumber,
            "email" : $scope.consumerEmail,
            "address" : {
                "line1" : $scope.consumerAddressLine1,
                "line2" : $scope.consumerAddressLine2,
                "city" : $scope.consumerCity,
                "state" : $scope.consumerState,
                "postalCode" : $scope.consumerPostalCode,
                "country" : "AU"
            }
            
            //,"notes" : $scope.consumerNotes
        }
    }
    
    function generateTransactionJson() {
        generateOrderTotal();
        if ($scope.manualPaymentTotal) {
            if ($scope.includeTips) {
                $scope.transactionPayload = [
                    {
                        "amount": parseInt($scope.manualPaymentTotal).toString(),
                        "prepaid": true,
                        "invoice": $scope.transacitonInvoice,
                        "tip": $scope.tipsAmount
                    }
                ];
            } else {
                $scope.transactionPayload = [
                    {
                        "amount": parseInt($scope.manualPaymentTotal).toString(),
                        "prepaid": true,
                        "invoice": $scope.transacitonInvoice
                    }
                ];
            }
            
        } else {
            if ($scope.includeTransaction) {
                if ($scope.includeTips) {
                    $scope.transactionPayload = [
                        {
                            "amount": $scope.transactionTotal,
                            "prepaid": true,
                            "invoice": $scope.transacitonInvoice,
                            "tip": $scope.tipsAmount
                        }
                    ];
                } else {
                    $scope.transactionPayload = [
                        {
                            "amount": $scope.transactionTotal,
                            "prepaid": true,
                            "invoice": $scope.transacitonInvoice
                        }
                    ];
                }
                
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
    
    $scope.setAcceptRewardsRedemptions = function (acceptRewardsRedemptions) {
        $scope.acceptRewardsRedemptions = acceptRewardsRedemptions;
        Meerkat.acceptRewardsRedemptions = acceptRewardsRedemptions;
    }
    
    $scope.setAcceptPointsRedemptions = function (acceptPointsRedemptions) {
        $scope.acceptPointsRedemptions = acceptPointsRedemptions;
        Meerkat.acceptPointsRedemptions = acceptPointsRedemptions;
    }

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
    
    $scope.setOrderSurcountAmount = function (orderSurcountAmount) {
        $scope.orderSurcountAmount = orderSurcountAmount;
        setOrderJson();
    }
    
    $scope.setOrderSurcountValue = function (orderSurcountValue) {
        $scope.orderSurcountValue = orderSurcountValue;
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
    
    $scope.setOrderSurcountIsPercentage = function (orderSurcountIsPercentage) {
        $scope.orderSurcountIsPercentage = orderSurcountIsPercentage;
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
    
    $scope.setConsumerEmail = function (consumerEmail) {
        $scope.consumerEmail = consumerEmail;
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
    
    $scope.setTipsAmount = function (tipsAmount) {
        $scope.tipsAmount = tipsAmount;
        setOrderJson();
    }
    
    $scope.setIncludeTips = function (includeTips) {
        $scope.includeTips = includeTips;
        setOrderJson();
    }

    $scope.formattedOrder = () => JSON.stringify($scope.orderPayload, undefined, 2);
    $scope.formattedTransaction = () => JSON.stringify($scope.transactionPayload, undefined, 2);
    $scope.formattedConsumer = () => JSON.stringify($scope.consumerPayload, undefined, 2);
    
    function setNewMemberJson(){
        $scope.newMemberJson = {
            "name": $scope.newMemberName,
            "email": $scope.newMemberEmail,
            "phone": $scope.newMemberPhone,
            "points": $scope.newMemberPoints,
            "address": {
                    "line1": $scope.newMemberAddressLine1,
                    "line2": $scope.newMemberAddressLine2,
                    "city": $scope.newMemberCity,
                    "state": $scope.newMemberState,
                    "country": "Au",
                    "postalCode": $scope.newMemberPostalCode
                }
            
        }
    }
    
    $scope.createMember = () => {
        setNewMemberJson();
        Meerkat.createMember($scope.newMemberJson, $scope.selectedOrginisation.id);
    }

    $scope.setNewMemberName = (newMemberName) => {
        $scope.newMemberName = newMemberName;
        setNewMemberJson();
    }
    $scope.setNewMemberEmail = (newMemberEmail) => {
        $scope.newMemberEmail = newMemberEmail;
        setNewMemberJson(); 
    }
    $scope.setNewMemberPhone = (newMemberPhone) => {
        $scope.newMemberPhone = newMemberPhone;
        setNewMemberJson();
    }
    $scope.setNewMemberPoints = (newMemberPoints) => {
        if (newMemberPoints) {
            $scope.newMemberPoints = newMemberPoints;
        } else {
            $scope.newMemberPoints = undefined;
        }
        setNewMemberJson();
    }
    $scope.setNewMemberAddressLine1 = (newMemberAddressLine1) => {
        if (newMemberAddressLine1) {
            $scope.newMemberAddressLine1 = newMemberAddressLine1;
        } else {
            $scope.newMemberAddressLine1 = undefined;
        }
        setNewMemberJson();
    }
    $scope.setNewMemberAddressLine2 = (newMemberAddressLine2) => {
        if (newMemberAddressLine2) {
            $scope.newMemberAddressLine2 = newMemberAddressLine2;
        } else {
            $scope.newMemberAddressLine2 = undefined;
        }
        setNewMemberJson();
    }
    $scope.setNewMemberCity = (newMemberCity) => {
        $scope.newMemberCity = newMemberCity;
        setNewMemberJson();
    }
    $scope.setNewMemberState = (newMemberState) => {
        $scope.newMemberState = newMemberState;
        setNewMemberJson();
    }
    $scope.setNewMemberPostalCode = (newMemberPostalCode) => {
        $scope.newMemberPostalCode = newMemberPostalCode;
        setNewMemberJson();
    } 

    $scope.fiveDollerReward = [{
        "ref": "1",
        "name": "Five Dollar Reward",
        "description" : "Five Dollars Off Check",
        "description" : "Five Dollar Reward",
        "surcountType" : "absolute",
        "surcountAmount" : "500"
    }]

    $scope.fivePercentReward = [{
        "ref": "1",
        "name": "Five Percent Reward",
        "description" : "Five Percent Off Check",
        "description" : "Five Percent Reward",
        "surcountType" : "percentage",
        "surcountAmount" : "5"
    }]
    
    $scope.formattedNewMember = () => JSON.stringify($scope.newMemberJson, undefined, 2);
    $scope.formattedFiveDollarRewardToSend = () => JSON.stringify($scope.fiveDollerReward, undefined, 2);
    $scope.formattedFivePercentRewardToSend = () => JSON.stringify($scope.fivePercentReward, undefined, 2);

    $scope.formattedJsonToSend = () => {
        var sendBody = {};
        sendBody.consumer = $scope.consumerPayload;
        sendBody.transactions = $scope.transactionPayload;
        sendBody.order = $scope.orderPayload;

        return JSON.stringify(sendBody, undefined, 2);

    };

    $scope.getFiveDollarRewardToSend = () => {
        var sendBody = {};
        sendBody = $scope.formattedFiveDollarRewardToSend();
        return sendBody;
    };

    $scope.getFivePercentRewardToSend = () => {
        var sendBody = {};
        sendBody = $scope.formattedFivePercentRewardToSend();
        return sendBody;
    };

    $scope.selectTab = function (tabName) {
        $scope.selectedTab = tabName;
    };
        
  $scope.getLocations = Meerkat.getLocations;
  $scope.startOver = () => WizardHandler.wizard().goTo(0);

  $scope.selectLocationAndGo = (locId, orgId) => {
    $scope.selectedOrginisation.id = orgId;
    $scope.selectedLocation.id = locId;
    Meerkat.organisationId = orgId;
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

$scope.getMembers = () => {
    Meerkat.getMembers($scope.selectedOrginisation.id);
};


$scope.addFiveDollarReward = (memberId) => {
    Meerkat.addFiveDollarReward(memberId, $scope.selectedOrginisation.id, $scope.getFiveDollarRewardToSend());
};

$scope.addFivePercentReward = (memberId) => {
    Meerkat.addFivePercentReward(memberId, $scope.selectedOrginisation.id, $scope.getFivePercentRewardToSend());
};

$scope.deleteMember = (memberId) => {
    Meerkat.deleteMember(memberId, $scope.selectedOrginisation.id);
}

$scope.addFiftyPointsToMember = (member) => {
member.points = member.points + 50;
    
    member.address.country = "Au";
    Meerkat.updateMember(member.id, $scope.selectedOrginisation.id, member);
}

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
