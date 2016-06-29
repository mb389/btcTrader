(function() {
angular
  .module('mainApp')
  .config(config)

  config.$inject = ['$stateProvider'];
  function config($stateProvider) {
    $stateProvider.state('dashboard', {
      url: '/',
        templateUrl: '/components/dashboard/dashboard.html',
        controller: 'DashCtrl',
        controllerAs: 'vm',
        resolve: {
          btcSpot: getSpotPx
        }
    })
  }

  getSpotPx.$inject = ['DashFactory']
  function getSpotPx(DashFactory) {
    return DashFactory.getTradePx('spot')
  }




})();
