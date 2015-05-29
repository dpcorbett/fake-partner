import React from 'react';
import { Navigation } from 'react-router';

let ConnectHandler = React.createClass({
  render() {
    var servers = this.props.store.refine('servers');
    var form = this.props.store.refine('forms', 'connect');
    var spec = this.props.store.refine('serverSpec');

    return <Connect servers={ servers } form={ form } spec={ spec }/>;
  }
});

let Connect = React.createClass({
  mixins: [Navigation],

  handleID(event) {
    this.props.form.merge({ clientId: event.target.value });
  },

  handleSecret(event) {
    this.props.form.merge({ clientSecret: event.target.value });
  },

  handleServer(event) {
    this.props.form.merge({ clientServer: event.target.value });
  },

  connect(e) {
    e.preventDefault();

    let { clientId, clientSecret, clientServer } = this.props.form.value;
    let auth = new Buffer(clientId + ':' + clientSecret).toString('base64');
    let url = 'wss://' + clientServer + '/partner/api/v1/socket?auth=' + auth;

    let spec = this.props.spec.set({ url, events: [] });

    this.transitionTo('server');
  },

  render() {
    let options = this.props.servers.value.map(item => <option value={ item }>{ item }</option>);
    let { clientId, clientSecret, clientServer } = this.props.form.value;
    var text = JSON.stringify(this.props.form.value);

    return (
      <form onSubmit={ this.connect }>
        <select value={ clientServer } onChange={ this.handleServer }>
          { options }
        </select>
        <label>Client ID:
          <input type="text" value={ clientId } onChange={ this.handleID } />
        </label>
        <label>Client Secret:
          <input type="text" value={ clientSecret } onChange={ this.handleSecret } />
        </label>
        <div>{ text }</div>
        <button type="submit">Connect</button>
      </form>
    );
  }
});

export default ConnectHandler;
