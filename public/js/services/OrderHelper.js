angular
  .module('FakePOSApp')
  .factory('OrderHelper', [
    '$http', '$q', '$modal', 'lodash', OrderHelperService
  ]);

function OrderHelperService($http, $q, $modal, _){

  var service = {};

  function isStatus(order, status){
    return status && order.status && order.status === status;
  }

  service.isOrderPending = _.partialRight(isStatus, 'pending');
  service.isOrderReadyToPay = _.partialRight(isStatus, 'ready to pay');
  service.isOrderAccepted = _.partialRight(isStatus, 'accepted');
  service.isOrderWaitingForPayment = _.partialRight(isStatus, 'waiting for payment');

  // TODO: this function and service.getTotal is kind of a copy from doshii/mobile/js
  function calcProductTotal(product, raw){
    var total = new BigNumber(product.price || 0);
    _.each(product.product_options, function(productOption){
      _.each(productOption.selected, function(variant){
        if(variant.price){
          total = total.plus(variant.price);
        }
      });
    });
    return raw ? total : total.div(100).toFixed(2);
  }

  service.getPaymentsTotal = function getPaymentsTotal(payments, raw){
    var total = new BigNumber(0);

    _.each(payments, function(payment){
      total = total.plus(payment.amount);
    });

    return raw ? total : total.div(100).toFixed(2);
  };

  service.getTotal = function getTotal(order, raw){
    var total = new BigNumber(0);
    _.each(order.items, function(product){
      total = total.plus(calcProductTotal(product, raw));
    });

    return raw ? total : total.toFixed(2);
  };

  service.getTotalMinusPayments = function getTotalMinusPayments(order, raw){
    var total = service.getTotal(order, true).minus(service.getPaymentsTotal(order.payments, true));
    return raw ? total : total.div(100).toFixed(2);
  };



  return service;
}
