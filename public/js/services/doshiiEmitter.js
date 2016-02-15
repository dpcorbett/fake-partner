angular
  .module('FakePartnerApp')
  .service('doshiiEmitter', ['eventEmitter', function(eventEmitter) {
    function DoshiiEmitter() {}

    eventEmitter.inject(DoshiiEmitter);

    return new DoshiiEmitter();
  }]);


