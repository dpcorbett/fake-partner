import React from 'react';

let ConnectHandler = React.createClass({
  willComponentMount() {
    var forms = this.props.store.refine('forms');
    forms.set({ connect: {} });
  },

  render() {
    var forms = this.props.store.refine('forms');

    return <Connect servers={ this.props.store.refine('servers') }
                    form={ forms.refine('connect') }/>;
  }
});

let Connect = React.createClass({
  handleClientID(event) {
    this.props.form.merge({ clientId: event.target.value });
  },

  handleClientSecret(event) {
    this.props.form.merge({ clientSecret: event.target.value });
  },

  render() {
    let options = this.props.servers.value.map(item => <option value={ item }>{ item }</option>);
    var text = JSON.stringify(this.props.form.value);

    return (
      <form>
        <select>
          { options }
        </select>
        <label>Client ID: <input type="text" onChange={ this.handleClientID } /></label>
        <label>Client Secret: <input type="text" onChange={ this.handleClientSecret } /></label>
      <div> { text } </div>
      </form>
    );
  }
});

export default ConnectHandler;
