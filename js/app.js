import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Map } from 'immutable';

import Connect from './components/Connect.js';

var store = Map({
  servers: [ 'alpha.doshii.co' ]
});

let App = React.createClass({
  render() {
    return (
      <div className="nav">
        {/* this is the important part */}
        <RouteHandler/>
      </div>
    );
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Connect} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
