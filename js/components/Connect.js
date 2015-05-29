import React from 'react';

let ConnectHandler = React.createClass({
  render() {
    return <Connect servers={ this.props.store.refine('servers') } />;
  }
});

let Connect = React.createClass({
  render() {
    let options = this.props.servers.value.map(item => <option value={ item }>{ item }</option>);
    return (
      <select>
        { options }
      </select>
    );
  }
});

export default ConnectHandler;
