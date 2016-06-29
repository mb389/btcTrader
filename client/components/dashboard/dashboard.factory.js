(function() {
  angular
    .module('mainApp')
    .factory('DashFactory',DashFactory);

    DashFactory.$inject = ['$http']
    function DashFactory($http) {
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
