angular
  .module('FakePOSApp')
  .service('Socket', [
    '$q', '$http', '$log', 'flash',
    'lodash', 'primus', 'primusUrl', 'Meerkat', SocketService
  ]);

function SocketService($q, $http, $log, flash, _, primus, primusUrl, Meerkat){
  var client = null;

  function init(){
    if (client) {
      return client;
    }

    client = primus;

    client.$on('open', () => {
      $log.info('EVENT: connect');
      flash.success = "Connected to " + primusUrl;

      Meerkat.sendConfig()
        .then(() => $q.all([
          Meerkat.getConsumers(),
          Meerkat.getTableAllocations(),
          Meerkat.getOrders(),
          Meerkat.getConfig()
        ]))
        .then(() => flash.success = 'Updated consumers, table allocations & orders');
    });

    client.$on('reconnect', function (event) {
      $log.info('EVENT: reconnect', event);
      flash.info = "Reconnected to " + primusUrl;
      Meerkat.getConsumers();
    });

    client.$on('order_create', function(data){
      $log.info('EVENT: order_create', data);
      Meerkat.updateOrders();
    });

    client.$on('table_allocation', function(data){
      $log.info('EVENT: table_allocation');
      $log.info(data);

      flash.info = "Table Allocation received";

      var existingAllocation = _.find(Meerkat.data.table_allocations, { meerkatConsumerId: data.meerkatConsumerId });
      Meerkat.data.table_allocations.splice( Meerkat.data.table_allocations.indexOf(existingAllocation), 1 );
      Meerkat.data.table_allocations.push(data);
    });

    client.$on('consumer_checkin', function(data){
      $log.info('event: consumer_checkin');
      $log.info(data);
      if (!data || !data.uri) {
        return;
      }

      flash.info = "Consumer checked in";
      Meerkat.getConsumer(data.uri);
    });

    client.$on('order_status', function(data){
      $log.info('event: order_status', data);
      flash.info = "Order: " + data.orderId + " status was updated to " + data.status;
      Meerkat.updateOrders();
    });

    client.$on('disconnect', function(){
      flash.warn = "disconnected from Doshii";
    });

    client.$on('invalid_token', function(data){
      $log.info('EVENT: invalid_token:', data.token);
      flash.warn = 'Pairing token [' + data.token + '] has become invalid';
    });

    client.$on('end', function(){
      $log.info('EVENT: end');
      flash.warn = 'Connection has been terminated by the server';
    });

    client.$on('error', function(){
      flash.error = "Could not connect to Doshii";
    });

    return client;
  }

  return {
    init: init
  };
}
