angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', 'Meerkat', PartnerCtrl ]);

function PartnerCtrl($scope, Meerkat) {
  console.log('loaded partner ctrl');
  $scope.locations = Meerkat.data.locations;

  $scope.getLocations = Meerkat.getLocations;
  Meerkat.getLocations();
}
