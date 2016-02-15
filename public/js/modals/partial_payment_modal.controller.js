angular
  .module('FakePartnerApp')
  .controller('PartialPaymentCtrl', [
  '$scope', '$modalInstance', 'lodash', 'OrderHelper', 'order', 'Meerkat', PartialPaymentCtrl
  ]);

function PartialPaymentCtrl($scope, $modalInstance, _, OrderHelper, order, Meerkat){
  //$scope.newTransactions = angular.copy(order.payments);
  $scope.newTransactions = [];

  $scope.existingTransactions = [];
  Meerkat.getTransactionsForOrder(order)
    .then(data => data.map(tr => $scope.existingTransactions.push(tr)));

  $scope.OrderHelper = OrderHelper;
  $scope.order = order;

  $scope.add = function add(payment){

    if($scope.newTransactions.length >= 1) {
      return;
    }

    if(_.isPlainObject(payment) && payment.amount && payment.reference){
      payment.amount = "" + payment.amount;
      $scope.newTransactions.push(payment);
    }

    if((payment instanceof BigNumber)){
      $scope.newTransactions.push(payment.toString());
    }
  };

  $scope.getInDollars = function getInDollars(amount){
    return new BigNumber(amount).div(100).toFixed(2);
  };

  var dirty = false;

  $scope.disableSaveButton = function disableSaveButton(){
    return false;
    //return !dirty  && $scope.newTransactions.length === 0;
  };

  $scope.remove = function remove(payment){
    dirty = !!$scope.newTransactions.splice(_.findIndex($scope.newTransactions, payment), 1).length;
  };

  $scope.close = _.partial($modalInstance.close, $scope.newTransactions);
}
