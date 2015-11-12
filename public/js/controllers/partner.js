angular
  .module('FakePartnerApp')
  .controller('PartnerCtrl', [ '$scope', 'Meerkat', 'OrderHelper', PartnerCtrl ]);

function PartnerCtrl($scope, Meerkat, OrderHelper) {
  console.log('loaded partner ctrl');
}
