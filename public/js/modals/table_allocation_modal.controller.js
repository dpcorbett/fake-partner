angular
  .module('FakePOSApp')
  .controller('TableAllocationCtrl', [
    '$scope', '$http', '$modalInstance', 'consumer', TableAllocationCtrl
  ]);

function TableAllocationCtrl($scope, $http, $modalInstance, consumer){

  $scope.data = {
    tableName: ''
  };

  $scope.consumer = consumer;

  $scope.ok = function() {
    $modalInstance.close($scope.data.tableName);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}


