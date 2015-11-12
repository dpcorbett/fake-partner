// Factory to share data between controllers
angular
  .module('FakePartnerApp')
  .factory('Meerkat', [
    '$http', '$q', '$modal', 'lodash', 'flash', 'OrderHelper', MeerkatService
  ]);

function getErrorMessage(error) {
  if (!error) {
    return '';
  }
  if (error.message) {
    return ' (' + error.message + ')';
  }
  if (error.length > 0 && error[0].message) {
    return ' (' + error[0].message + ')';
  }
  return '';
}

function MeerkatService($http, $q, $modal, _, flash, OrderHelper){

  var Meerkat = {
    data: {
      config: {},
      consumers: [],
      orders: [],
      table_allocations: []
    }
  };

  Meerkat.sendConfig = function(configOverrides) {
    var config = Object.assign({
      restaurantMode: 'restaurant',
      tableMode: 'selection',
      checkoutOnPaid: true,
      deallocateTableOnPaid: true
    }, configOverrides);
    return $http.put('/config', config);
  };

  Meerkat.getConfig = function() {
    return $http.get('/config')
      .then(res => {
        Object.assign(Meerkat.data.config, res.data);
        delete Meerkat.data.config.modeConfigured;
        return Meerkat.data.config;
      })
      .catch(err => flash.error = 'Getting config failed: ' + err.data.details[0].message);
  };

  Meerkat.getOrders = function getOrders(){
    return $http.get('/orders')
      .then(function(res){
        return $q.all(_.map(res.data, function(order){
          return Meerkat.getOrder(order.uri);
        }));
      })
      .then(function(orders){
        Meerkat.data.orders = _.map(orders, 'data');
        return orders;
      });
  };

  Meerkat.getOrder = function getOrder(orderUri) {
    return $http.get(orderUri);
  };

  Meerkat.getTableAllocations = function getTableAllocations() {
    return $http.get('/tables').then(function(res){
      Meerkat.data.table_allocations = res.data;
    });
  };

  Meerkat.updateOrders = function updateOrders() {
    return Meerkat.getOrders();
  };

  Meerkat.updateOrderStatus = function updateOrderStatus(eventData) {
    var orderToBeUpdated = _.findIndex(Meerkat.data.orders, {id: eventData.orderId});
    Meerkat.data.orders[orderToBeUpdated].status = eventData.status;
  };

  Meerkat.allocateTable = function(consumer, tableName) {
    return $http.post('/consumers/' + consumer.meerkatConsumerId + '/table', {tableName: tableName}  )
      .then(function(res){
        Meerkat.data.table_allocations.push(angular.copy(res.data));
      });
  };

  Meerkat.getConsumer = function getConsumer(consumerUri){
    return $http.get(consumerUri).then(function(res){
      var loggedInConsumer = _.where(Meerkat.data.consumers, {meerkatConsumerId: res.data.meerkatConsumerId});

      if (!loggedInConsumer.length) {
        Meerkat.data.consumers.push(angular.copy(res.data));
      }
    });
  };

  Meerkat.getConsumers = function getConsumers() {
    // get the currently checked in consumers
    return $http.get('/consumers').then(function(res){

      var promises =  _.map(res.data, function(consumer){
        return $http.get(consumer.uri);
      });

      return $q.all(promises).then(function(consumers){
        Meerkat.data.consumers = _.map(consumers, function(consumer){
          return consumer.data;
        });
      });
    });
  };

  Meerkat.acceptOrder = function acceptOrder(order){
    console.log(order);
    return $http.put(order.uri, { order: {
      status: 'accepted' ,
      updatedAt: order.updatedAt,
      items: _.map(order.items, function(item){ item.status = 'accepted'; return item; })
    }})
    .then(function(res) {
      order.status = 'accepted';
      order.updatedAt = res.data.updatedAt;
      flash.info = 'Accepted order ' + order.id;
    });
  };

  Meerkat.rejectOrder = function rejectOrder(order){
    console.log(order);
    return $http.put(order.uri, {order: {
      status: 'rejected',
      items: order.items,
      updatedAt: order.updatedAt
    }})
    .then(function(res) {
      order.status = 'rejected';
      order.updatedAt = res.data.updatedAt;
      flash.info = 'Rejected order ' + order.id;
    });
  };

  Meerkat.waitForPayment = function waitForPayment(order){
    return $http.put(order.uri, { order: {
      status: 'waiting for payment',
      items: order.items,
      updatedAt: order.updatedAt

    }})
    .then(function(res) {
      order.status = 'waiting for payment';
      order.updatedAt = res.data.updatedAt;
      flash.info = 'Waiting for payment of order ' + order.id;
    });
  };

  Meerkat.allowTableSelection = function allowTableSelection(table){
    return $http.put('/consumers/' + table.meerkatConsumerId + '/table/' + table.id, {status: "confirmed"})
      .then(function(){
        table.status = "confirmed";
        flash.info = "Updated table allocation status";
      });
  };


  Meerkat.disallowTableSelection = function disallowTableSelection(table, reasonCode){

    var request = {
      method: 'DELETE',
      url: '/consumers/' + table.meerkatConsumerId + '/table/' + table.id,
      data: { reasonCode: reasonCode },
      headers: { 'Content-Type': 'application/json' }
    };
    return $http(request)
      .then(function(){
        Meerkat.data.table_allocations = _.remove(Meerkat.data.table_allocations, function(table_allocation){
          return table.id !== table_allocation.id;
        });
        flash.info = "Table selection disallowed";
      });
  };

  Meerkat.createOrder = function createOrder(orderId, postBody) {

    var parsedBody;

    try {
      parsedBody = JSON.parse(postBody)
    } catch (e) {
      flash.error = 'Invalid JSON: ' + e.toString();
      return;
    }

    return $http.put('/orders/' + orderId, parsedBody)
      .then(res => {
        var order = angular.copy(res.data);
        Meerkat.data.orders.push(order);
        flash.success = 'Order sent'
        return order;
      })
      .catch(err => {
        flash.error = 'Order not sent: ' + err.statusText + getErrorMessage(err.data);
        throw err;
      });
  };

  Meerkat.sendProducts = function sendProducts(products){
    try {
      console.log(products);
      JSON.parse(products);
    } catch (e) {
      flash.error = 'Input must be valid JSON: ' + e.message;
      return;
    }

    return $http.post('/products', products)
      .then(function() {
        flash.info = 'Products uploaded';
      })
      .catch(function(err) {
        flash.error = 'Failed to upload products: ' + err.statusText + getErrorMessage(err.data);
      });
  };

  Meerkat.showPartialPaymentModal = function showPartialPaymentModal(order){
    return $modal.open({
      templateUrl: 'js/modals/partial_payment_modal.html',
      controller: 'PartialPaymentCtrl',
      resolve: {
        order: _.partial(_.identity, order)
      }
    });
  };

  Meerkat.addPayment = function addPayment(order){
    var modalInstance = Meerkat.showPartialPaymentModal(order);
    var payments;
    var status = 'accepted';

    return modalInstance.result.then(function(_payments){
      if(!_payments){
        console.error('No payments selected.');
        return;
      }

      payments = _payments;

      var orderTotal = OrderHelper.getTotal(order, true);

      if ((OrderHelper.getPaymentsTotal(payments, true)).gte(orderTotal)){
        console.log('Payments are >= order total, marking as paid');
        status = 'paid';
      }

      return $http.put(order.uri, {
        order: {
          status: status,
          updatedAt: order.updatedAt,
          items: order.items,
          payments: _payments
        }
      });
     })
     .then(function(res) {
       if(!res){
         return;
       }

       order.status = status;
       order.updatedAt = res.data.updatedAt;
       order.payments = payments;

       flash.success = 'Order updated ' + order.id;
     })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };

  Meerkat.hasTableAllocation = function hasTableAllocation(consumer){
    return _.find(Meerkat.data.table_allocations, _.pick(consumer, 'meerkatConsumerId'));
  };

  var tableAllocationModal = null;

  Meerkat.showTableAllocationModal = function showTableAllocationModal(consumer){
    if (tableAllocationModal) {
      return tableAllocationModal;
    }

    tableAllocationModal = $modal.open({
      templateUrl: 'js/modals/table_allocation_modal.html',
      controller: 'TableAllocationCtrl',
      resolve: {
        consumer: _.partial(_.identity, consumer)
      }
    });

    tableAllocationModal.result
      .then(_.partial(Meerkat.allocateTable, consumer))
      .finally(() => tableAllocationModal = null);
  };

  return Meerkat;
}
