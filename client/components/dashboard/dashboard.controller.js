(function() {
  angular
    .module('mainApp')
    .controller('DashCtrl',DashCtrl);

    DashCtrl.$inject = ['DashFactory','btcSpot']
    function DashCtrl(DashFactory,btcSpot) {

      console.log(btcSpot)
      var vm = this;
      vm.spot = btcSpot;


    }
})();
