import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Cursor } from 'react-cursor';

import Connect from './components/Connect.js';

let App = React.createClass({
  getInitialState() {
    return {
      servers: [ 'alpha.doshii.co' ],
      forms: {
        connect: {
          clientId: 'a9678f165f7cfae5adc425a0233629d5b774822cc6ef7a9cf46613a18c5218b2',
          clientSecret: '83376f3562f719f694e14862aa716d688eb46bb867f93f4f251a44ed5e288d7b'
        }
      }
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
