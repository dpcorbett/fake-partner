// Factory to share data between controllers
angular
  .module('FakePartnerApp')
  .factory('Meerkat', [ '$http', 'flash', MeerkatService ]);

function MeerkatService($http, flash){

  var Meerkat = {
    data: {
      locations: []
    }
  };

  Meerkat.getLocations = function() {
    return $http.get('/locations')
      .then(res => {
        Meerkat.data.locations.length = 0;

        Array.prototype.push.apply(Meerkat.data.locations, res.data);
        flash.success = 'Updated Locations';

        return Meerkat.data.locations;
      })
      .catch(err => flash.error = 'Getting locations failed');
  };

  Meerkat.getOrder = function(orderId) {
    return $http.get('/orders/' + orderId)
      .catch(err => flash.error = 'Getting order "' + orderId + '" failed');
  };

  Meerkat.getTableFor = function(tableName, locationId) {

    var req = {
      method: 'GET',
      url: '/tables/' + tableName,
      headers: {
        'doshii-location-id': locationId
      }
    };

    return $http(req).catch(err => flash.error = 'Getting table info failed.');
  };

  Meerkat.readyToPay = function(order) {
    var req = {
      method: 'PUT',
      url: '/orders/' + order.id,
      data: {
        tip: '0',
        status: 'ready to pay',
        updatedAt: order.updatedAt
      }
    };

    return $http(req).catch(err => flash.error = 'Updating order failed.');
  };


  Meerkat.paid = function(order) {
    var req = {
      method: 'PUT',
      url: '/orders/' + order.id,
      data: {
        tip: '0',
        status: 'paid',
        updatedAt: order.updatedAt,
        transactionId: "123",
        invoiceId: "123"
      }
    };

    return $http(req).catch(err => flash.error = 'Updating order failed.');
  };

  return Meerkat;
}
