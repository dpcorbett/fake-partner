import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

let App = React.createClass({
  render() {
    return (
      <div className="nav">
        <h1> HELLO ZOG </h1>
        {/* this is the importTant part */}
        <RouteHandler/>
      </div>
    );
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>

  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
