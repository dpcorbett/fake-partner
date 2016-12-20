angular
  .module('FakePartnerApp')
  .service('Socket', [
    'clientId', 'clientSecret', 'websocketUrl', 'doshiiEmitter', SocketService
  ]);

function SocketService(clientId, clientSecret, websocketUrl, doshiiEmitter){
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
        return console.debug('received ' + '"' + data + '"');
      }

      console.debug(data.emit[0], data.emit[1]);
      doshiiEmitter.emit(data.emit[0], data.emit[1]);
    };
  }

  return {
    init: init
  };
}
