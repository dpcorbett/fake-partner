import React from 'react';

let ConnectHandler = React.createClass({
  render() {
    var servers = this.props.store.refine('servers');
    var form = this.props.store.refine('forms', 'connect');

    return <Connect servers={ servers } form={ form } />;
  }
});

let Connect = React.createClass({
  handleClientID(event) {
    this.props.form.merge({ clientId: event.target.value });
  },

  handleClientSecret(event) {
    this.props.form.merge({ clientSecret: event.target.value });
  },

  connect() {
    var { clientId, clientSecret } = this.props.form.value;

  },

  render() {
    let options = this.props.servers.value.map(item => <option value={ item }>{ item }</option>);
    let { clientId, clientSecret } = this.props.form.value;

    return (
      <form onSubmit={ this.connect }>
        <select>
          { options }
        </select>
        <label>Client ID:
          <input type="text" value={ clientId } onChange={ this.handleClientID } />
        </label>
        <label>Client Secret:
          <input type="text" value={ clientSecret } onChange={ this.handleClientSecret } />
        </label>
      </form>
    );
  }
});

export default ConnectHandler;
