import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { Cursor } from 'react-cursor';

import ConnectHandler from './components/Connect.js';
import Orders from './components/Orders';
import Server from './components/Server.js'

let App = React.createClass({
  getInitialState() {
    return {
      servers: [ 'alpha.doshii.co', 'beta.doshii.co' ],
      order: {
        "id": "46",
        "status": "paid",
        "checkinId": "82",
        "tip": "0",
        "payments": [
            {
                "type": "cash",
                "amount": "99"
            }
        ],
        "paySplits": 0,
        "splitWays": 0,
        "payTotal": null,
        "notPayingTotal": null,
        "items": [
            {
                "name": "Magnesium",
                "description": "NOT THE PRODUCT YOU'RE LOOKING FOR",
                "price": 99,
                "pos_id": "mg_ss",
                "status": "accepted"
            },
            {
                "name": "Zinc",
                "description": "NOT THE PRODUCT YOU'RE LOOKING FOR",
                "price": 99,
                "pos_id": "mg_ss",
                "status": "accepted"
            },

        ],
        "surcounts": [],
        "updatedAt": "2015-05-20T06:15:45.882Z",
        "uri": "https://localhost/partner/api/v1/orders/46"
    },
      forms: {
        connect: {
          clientId: 'a9678f165f7cfae5adc425a0233629d5b774822cc6ef7a9cf46613a18c5218b2',
          clientSecret: '83376f3562f719f694e14862aa716d688eb46bb867f93f4f251a44ed5e288d7b',
          clientServer: 'alpha.doshii.co'
        }
      },
      serverSpec: {}
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
    <DefaultRoute handler={ConnectHandler} />
    <Route name="orders" path="/orders/:id" handler={Orders} />
    <Route name="server" path="/server" handler={Server}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
