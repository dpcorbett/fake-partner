// Factory to share data between controllers
angular
  .module('FakePartnerApp')
  .factory('Meerkat', [ '$http', '$modal', 'flash', MeerkatService ]);

function MeerkatService($http, $modal, flash){

  var Meerkat = {
    data: {
      locations: [],
      pendingTransactions: [],
      products: [],
      surcounts: [],
      members: []
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

Meerkat.getMenu = function (locationId) {
    return $http.get('/locations/' + locationId + '/menu')
      .then(res => {
        Meerkat.data.products.length = 0;
        Meerkat.data.surcounts.length = 0;
        
        Array.prototype.push.apply(Meerkat.data.products, res.data.products);
        Array.prototype.push.apply(Meerkat.data.surcounts, res.data.surcounts);
        flash.success = 'Updated Menu';
        
        return Meerkat.data.products;
    })
      .catch(err=> flash.error = 'Getting Menu failed');
};

Meerkat.getMembers = function (organisationId) {
    return $http.get('/members', {
        headers: { 'doshii-organisation-id': organisationId }
    })
      .then(res => {
        Meerkat.data.members.length = 0;
        
        Array.prototype.push.apply(Meerkat.data.members, res.data);
        flash.success = 'Updated Members';
        
        return Meerkat.data.members;
    })
      .catch(err=> flash.error = 'Getting Members failed ' + organisationId );
};

  Meerkat.getOrder = function(orderId) {
    return $http.get('/orders/' + orderId)
      .catch(err => flash.error = 'Getting order "' + orderId + '" failed');
  };

  Meerkat.sendOrder = function(jsonToSend, locationId) {
    //var parsedBody = {};

    //try {
    //    parsedBody.consumer = JSON.parse(consumerBody);
    //    parsedBody.transactions = JSON.parse(transactionBody);
    //    parsedBody.order = JSON.parse(orderBody);
    //} catch (e) {
    //  flash.error = 'Invalid order JSON: ' + e;
    //  return;
    //}

    var req = {
      method: 'POST',
      url: '/orders',
      data: jsonToSend,
      headers: {
        'doshii-location-id': locationId
      }
    };

    return $http(req)
      .then(res => {
        var order = angular.copy(res.data);
        console.log(order);
        flash.success = 'Order sent';
        return order;
      })
      .catch(err => {
        flash.error = 'Order not sent: ' + err.statusText + getErrorMessage(err.data);
        throw err;
      });
  };

  Meerkat.updateTransaction = function(transactionUri) {
    return $http.get(transactionUri)
      .then(res => {
        if (res.data.id === Meerkat.data.pendingTransactions[0].id) {
          Meerkat.data.pendingTransactions[0] = res.data;
        }
      })
      .catch(err => flash.error = 'Updating transaction failed');
  };

  Meerkat.getOrdersForTable = function(tableName, locationId) {
    var req = {
      method: 'GET',
      url: '/tables/' + tableName + '/orders',
      headers: {
        'doshii-location-id': locationId
      }
    };

    return $http(req).catch(err => flash.error = 'Getting orders for table "' + tableName + '" failed');
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

  Meerkat.showPartialPaymentModal = function showPartialPaymentModal(order) {
    return $modal.open({
      templateUrl: 'js/modals/partial_payment_modal.html',
      controller: 'PartialPaymentCtrl',
      resolve: {
        order: _.partial(_.identity, order)
      }
    });
  };

  Meerkat.addPayment = function addPayment(order) {
    var modalInstance = Meerkat.showPartialPaymentModal(order);
    var payments;

    return modalInstance.result.then(function(_payments) {
      if (!_payments) {
        console.error('No payments selected.');
        return;
      }

      payments = _payments;

      return _payments.map(p => $http.post(order.uri + '/transactions', p)
        .then(res => Meerkat.data.pendingTransactions.push(res.data))
        .catch(err => {
          console.log(err);
          throw err;
        }));
    })
      .then(() => flash.success = 'Transaction(s) sent');
  };

  Meerkat.getTransactionsForOrder = function getTransactionsForOrder(order) {
    return $http.get(`/orders/${order.id}/transactions`).then(res => res.data);
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

  Meerkat.complete = function(transaction) {
    var req = {
      method: 'PUT',
      url: transaction.uri,
      data: {
        amount: transaction.amount,
        version: transaction.version,
        status: 'complete',
        reference: 'FakePartnerCash',
        invoice: 'invoice no.'
      }
    };
    
    return $http(req)
      .then(() => Meerkat.data.pendingTransactions.length = 0)
      .catch(err => flash.error = 'Failed to complete transaction: ' + err.message || err);
  };

  return Meerkat;
}
