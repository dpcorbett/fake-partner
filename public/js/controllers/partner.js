angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', PartnerCtrl ]);

function PartnerCtrl($scope) {
  console.log('loaded partner ctrl');
}
