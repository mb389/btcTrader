(function() {
  angular
    .module('mainApp')
    .factory('DashFactory',DashFactory);

    DashFactory.$inject = ['$http','$websocket']
    function DashFactory($http,$websocket) {
      var factory = {
        getTradePx
      }
      return factory;

      function getTradePx(q) {
        var type;
        if (q > 0) type = 'buy';
        else if (q < 0) type = 'sell';
        else type = 'spot'

        return $http.get(`/data/price/${type}`)
              .then(res => Number(JSON.parse(res.data).data.amount))
              .catch(err => console.log(err))
      }

    }
})();
