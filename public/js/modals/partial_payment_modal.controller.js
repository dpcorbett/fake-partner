angular
  .module('FakePOSApp')
  .controller('PartialPaymentCtrl', [
  '$scope', '$modalInstance', 'lodash', 'OrderHelper', 'order', PartialPaymentCtrl
  ]);

function PartialPaymentCtrl($scope, $modalInstance, _, OrderHelper, order){
  $scope.payments = angular.copy(order.payments);

  $scope.OrderHelper = OrderHelper;
  $scope.order = order;

  $scope.add = function add(payment){
    if(_.isPlainObject(payment) && payment.amount && payment.type){
      payment.amount = "" + payment.amount;
      $scope.payments.push(payment);
    }

    if((payment instanceof BigNumber)){
      $scope.payments.push(payment.toString());
    }
  };

  $scope.getInDollars = function getInDollars(amount){
    return new BigNumber(amount).div(100).toFixed(2);
  };

  var dirty = false;

  $scope.disableSaveButton = function disableSaveButton(){
    return !dirty  && $scope.payments.length === 0;
  };

  $scope.remove = function remove(payment){
    dirty = !!$scope.payments.splice(_.findIndex($scope.payments, payment), 1).length;
  };

  $scope.close = _.partial($modalInstance.close, $scope.payments);
}
