angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', 'Meerkat', 'WizardHandler', PartnerCtrl ]);

function PartnerCtrl($scope, Meerkat, WizardHandler) {
  console.log('loaded partner ctrl');
  Meerkat.getLocations();

  $scope.locations = Meerkat.data.locations;

  $scope.order = {};
  $scope.tableInfo = [];
  $scope.selectedLocation = {id: null};
  $scope.selectedTable = {name: null};

  $scope.getLocations = Meerkat.getLocations;
  $scope.startOver = () => WizardHandler.wizard().goTo(0);

  $scope.selectLocationAndGo = (locId) => {
    $scope.selectedLocation.id = locId;
    WizardHandler.wizard().next();
  };

  $scope.fetchTableAndGo = () => {
    Meerkat.getTableFor($scope.selectedTable.name, $scope.selectedLocation.id)
      .then(res => {
        $scope.tableInfo.length = 0;
        Array.prototype.push.apply($scope.tableInfo, res.data);

        if($scope.tableInfo.length > 0) {
          WizardHandler.wizard().next();
        }
      });
  };

  $scope.getOrderAndGo = orderId => Meerkat.getOrder(orderId)
    .then(res => {
      $scope.order = res.data;

      if ($scope.order.id) {
        WizardHandler.wizard().next();
      }
    });
}
