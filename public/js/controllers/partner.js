angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', 'flash', 'Meerkat', 'WizardHandler', 'doshiiEmitter', PartnerCtrl ]);

function PartnerCtrl($scope, flash, Meerkat, WizardHandler, doshiiEmitter) {
  console.log('loaded partner ctrl');
  Meerkat.getLocations();

  $scope.locations = Meerkat.data.locations;

  $scope.order = {};
  $scope.tableOrders = [];
  $scope.selectedLocation = {id: null};
  $scope.selectedTable = {name: null};

  $scope.getLocations = Meerkat.getLocations;
  $scope.startOver = () => WizardHandler.wizard().goTo(0);

  $scope.selectLocationAndGo = (locId) => {
    $scope.selectedLocation.id = locId;
    WizardHandler.wizard().next();
  };

  doshiiEmitter.on('order_change', updateOrder);
  function updateOrder(event) {
    if(event.orderId === $scope.order.id) {
      Meerkat.getOrder($scope.order.id).then(res => $scope.order = res.data)
    }
  }

  $scope.fetchTableAndGo = () => {
    Meerkat.getOrdersForTable($scope.selectedTable.name, $scope.selectedLocation.id)
      .then(res => {
        $scope.tableOrders.length = 0;
        Array.prototype.push.apply($scope.tableOrders, res.data);

        if($scope.tableOrders.length > 0) {
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

  $scope.sendReadyToPay = () => {

    Meerkat.getOrder($scope.order.id)
      .then(res => Meerkat.readyToPay(res.data))
      .then(() => WizardHandler.wizard().next());
  };

  $scope.sendPaid = () => {
    Meerkat.paid($scope.order)
      .then(() => {
        $scope.startOver();
        flash.success = 'Order paid successfully';
        $scope.order = {};
      });
  };
}
