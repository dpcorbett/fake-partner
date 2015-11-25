angular
  .module('FakePartnerApp')
  .service('Socket', [
    'flash', 'clientId', 'clientSecret', 'websocketUrl', SocketService
  ]);

function SocketService(flash, clientId, clientSecret, websocketUrl){
  var ws = null;

  function init() {

    if (ws) {
      return ws;
    }

    // btoa is supported by modern browsers
    var auth = btoa(clientId + ':' + clientSecret);

    // WebSocket is supported by most modern browsers
    ws = new WebSocket(websocketUrl + '?auth=' + auth);

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
        return console.debug('received ' + '"' + data + '"');
      }

      console.log(data.emit);
    };
  }

  return {
    init: init
  };
}
