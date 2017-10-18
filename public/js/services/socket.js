angular
  .module('FakePartnerApp')
  .service('Socket', [
    'clientId', 'clientSecret', 'websocketUrl', 'doshiiEmitter', 'Meerkat', SocketService
  ]);

function SocketService(clientId, clientSecret, websocketUrl, doshiiEmitter, Meerkat){
  var ws = null;

  function init() {

    if (ws) {
      return ws;
    }

    // btoa is supported by modern browsers
    var auth = btoa(clientId + ':' + clientSecret);

    // WebSocket is supported by most modern browsers
    var url = websocketUrl.replace(/api\/v.\//, '');
    ws = new WebSocket(url + '?auth=' + auth);

    // After connecting we need to send heartbeats
    ws.onopen = function(event) {

      function heartbeat() {
        var time = (new Date()).getTime();
        var message = '"primus::ping::' + time + '"';
        console.debug('sent     ' + message);
        ws.send(message);
      }

      heartbeat(); // Send one immediately to complete the handshake
      setInterval(heartbeat, 5000); // Then one every few seconds thereafter to keep alive
    };

    // handle the events
    ws.onmessage = function(event) {
      if (!event) return;

      var data = JSON.parse(event.data);
      
      if (!data.emit) {
        return console.log('received ' + '"' + data + '"');
      }
      console.log(data.emit[0]);
      if (data.emit[0].indexOf("points_redemption", 0) > -1){
                //is a points redemption
                console.log("Process Points Redemption");
                Meerkat.processPointsRedemption(data.emit[1].memberId);
      }
      if (data.emit[0].indexOf("reward_redemption", 0) > -1) {
                //is a rewards redemption
                console.log("Process Rewards Redemption");
                Meerkat.processRewardsRedemption(data.emit[1].memberId, data.emit[1].rewardId);
      }
      if (data.emit[0].indexOf("transaction_updated", 0) > -1) {
                //is a rewards redemption
                console.log("Process transaction update");
                Meerkat.processTransactionWaiting(data.emit[1].id, data.emit[1].orderId, data.emit[1].status);
      }
      if (data.emit[0].indexOf("transaction_created", 0) > -1) {
        //is a rewards redemption
        console.log("Process refund transaction");
        console.log("Details");
        console.log(data.emit[1].id);
        console.log(data.emit[1].orderId);
        console.log(data.emit[1].status);

        Meerkat.processTransactionWaiting(data.emit[1].id, data.emit[1].orderId, data.emit[1].status);
}
      console.debug(data.emit[0], data.emit[1]);
      doshiiEmitter.emit(data.emit[0], data.emit[1]);
    };
  }

  return {
    init: init
  };
}
