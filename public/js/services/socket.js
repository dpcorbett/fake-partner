angular
  .module('FakePartnerApp')
  .service('Socket', [
    'flash', 'clientId', 'clientSecret', 'websocketUrl', SocketService
  ]);

function SocketService(flash, clientId, clientSecret, websocketUrl){
  var client = null;

  function init2(){
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


  function init() {
    // btoa is supported by modern browsers
    var auth = btoa(clientId + ':' + clientSecret);

    // WebSocket is supported by most modern browsers
    var ws = new WebSocket(websocketUrl + '?auth=' + auth);

    // After connecting we need to send heartbeats
    ws.onopen = function(event) {

      function heartbeat() {
        var time = (new Date()).getTime();
        ws.send('"primus::ping::' + time + '"');
      }

      heartbeat(); // Send one immediately to complete the handshake
      setInterval(heartbeat, 5000); // Then one every few seconds thereafter to keep alive
    };

    // handle the events
    ws.onmessage = function(event) {
      if (!event) return;

      var data = JSON.parse(event.data);

      if (!data.emit) return;

      console.log(data.emit);
    };
  }

  return {
    init: init
  };
}
