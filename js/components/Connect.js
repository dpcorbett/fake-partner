import React from 'react';

let ConnectHandler = React.createClass({
  render() {
    var servers = this.props.store.refine('servers');
    var form = this.props.store.refine('forms', 'connect');

    return <Connect servers={ servers } form={ form } />;
  }
});

let Connect = React.createClass({
  handleID(event) {
    this.props.form.merge({ clientId: event.target.value });
  },

  handleSecret(event) {
    this.props.form.merge({ clientSecret: event.target.value });
  },

  handleServer(event) {
    this.props.form.merge({ clientServer: event.target.value });
  },

  connect() {
    let { clientId, clientSecret, clientServer } = this.props.form.value;

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
      </form>
    );
  }
});

export default ConnectHandler;
