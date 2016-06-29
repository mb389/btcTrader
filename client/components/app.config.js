(function() {
  angular
    .module('mainApp')
    .config(Router)

      Router.$inject = ["$urlRouterProvider", "$locationProvider"];
      function Router($urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
      }
})();
