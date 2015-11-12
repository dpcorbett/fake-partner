import React from 'react';


let OrdersHandler = React.createClass({
  render() {
    var order = this.props.store.refine('order');

    return <Order data={ order } />;
  }
});

let Order = React.createClass({

  handleStatusChange(event){
    console.log('eret');
  },

  render() {

    let {items, status} = this.props.data.value;

    let lineItems = items.map(item => <p>{item.name}</p>)

    return (
      <div>
        <h1>Order</h1>

        <table>
          <tr>
            <th>status </th>
            <th>items</th>
            <th>actions</th>
          </tr>

          <tr>
            <td>{ status} </td>
            <td>
                { lineItems}
            </td>
            <td>
                <input type="button" onClick={this.handleStatusChange} value="Paid"/>
            </td>
          </tr>

        </table>
      </div>
    );
  }
});


export default OrdersHandler;
