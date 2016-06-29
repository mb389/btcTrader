(function() {
  angular
    .module('mainApp')
    .controller(DashCtrl);

    DashCtrl.$inject = ['DashFactory','btcSpot']
    function DashCtrl(DashFactory,btcSpot) {

      console.log(btcSpot)


    }
})();
