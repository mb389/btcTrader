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

      function getTradePx(type) {
        return $http.get(`/data/price/${type}`)
              .then(res => Number(JSON.parse(res.data).data.amount))
              .catch(err => console.log(err))
      }

    }
})();
