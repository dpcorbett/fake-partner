import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Cursor } from 'react-cursor';

import Connect from './components/Connect.js';

let App = React.createClass({
  getInitialState() {
    return {
      servers: [ 'alpha.doshii.co' ],
      forms: {}
    };
  },

  render() {
    let cursor = Cursor.build(this);

    return (
      <div className="nav">
        {/* this is the important part */}
        <RouteHandler store={ cursor }/>
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
