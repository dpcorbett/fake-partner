angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', 'Meerkat', PartnerCtrl ]);

function PartnerCtrl($scope, Meerkat) {
  console.log('loaded partner ctrl');
  $scope.locations = Meerkat.data.locations;
  $scope.tableName = "";
  $scope.locationId = "";
  $scope.tableInfo = [];


  $scope.getLocations = Meerkat.getLocations;
  $scope.getTableFor = (tableName, locationId) => {
    Meerkat.getTableFor(tableName, locationId).then(res => {
      $scope.tableInfo.length = 0;
      Array.prototype.push.apply($scope.tableInfo, res.data)
    });
  };

  Meerkat.getLocations();
}
