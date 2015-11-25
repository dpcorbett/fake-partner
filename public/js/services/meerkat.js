// Factory to share data between controllers
angular
  .module('FakePartnerApp')
  .factory('Meerkat', [
    '$http', 'flash', MeerkatService
  ]);

function MeerkatService($http, flash){

  var Meerkat = {
    data: {
      locations: []
    }
  };

  Meerkat.getLocations = function() {
    return $http.get('/locations')
      .then(res => {
        Meerkat.data.locations.length = 0;

        Array.prototype.push.apply(Meerkat.data.locations, res.data);
        flash.success = 'Updated Locations';

        return Meerkat.data.locations;
      })
      .catch(err => flash.error = 'Getting locations failed');
  };

  Meerkat.getTableFor = function(tableName, locationId) {

    var req = {
      method: 'GET',
      url: '/tables/' + tableName,
      headers: {
        'doshii-location-id': locationId
      }
    };

    return $http(req).catch(err => flash.error = 'Getting table info failed.');
  };

  return Meerkat;
}
