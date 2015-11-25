angular
  .module('FakePartnerApp')
  .controller('TableCtrl', [ '$scope', 'Meerkat', PartnerCtrl ]);

function PartnerCtrl($scope, Meerkat) {
  console.log('loaded table ctrl');
  $scope.tableName = "";

  $scope.table = null;
}
