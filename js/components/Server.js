import React from 'react';
import { Navigation } from 'react-router';

let ServerHandler = React.createClass({
  mixins: [ Navigation ],

  // componentWillMount() {
  //   if (!this.props.store.refine('serverSpec').value.url) {
  //     this.transitionTo('app');
  //   };
  // },

  render() {
    var spec = this.props.store.refine('serverSpec');
    return <Server spec={ spec } />;
  }
});

let Server = React.createClass({
  componentDidMount: function() {
    var spec = this.props.spec;

    this._ws = new WebSocket(spec.value.url);

    this._ws.onopen = event => {

      this._timer = window.setInterval(() => {
        var time = (new Date()).getTime();
        this._ws.send('"primus::ping::"' + time + '"');
      }, 1000);
    };

    this._ws.onerror = (e) => console.log(e);

    let events = spec.refine('events');

    this._ws.onmessage = event => {
      if (!event) { return; }
      var data = JSON.parse(event.data);
      if (!data.emit) { return; }

      events.push([{ name: data.emit[0], payload: data.emit[1] }]);
    };
  },

  componentWillUnmount: function() {
    window.clearTimeout(this._timer);
  },

  render() {
    var events = this.props.spec.refine('events').value
          .map(ev => <div>Name: { ev.name } with payload: { ev.payload }</div>);

    return <div>{ events }</div>;
  }
});

export default ServerHandler;
