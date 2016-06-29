(function() {
  angular
    .module('mainApp')
    .controller('DashCtrl',DashCtrl);

    DashCtrl.$inject = ['DashFactory','btcSpot']
    function DashCtrl(DashFactory,btcSpot) {

      var vm = this;
      vm.spot = btcSpot;
      vm.quantity = 5; //default quantity
      vm.submitTrade = submitTrade;
      vm.priceUpdate = priceUpdate;

      /////////////////////////////

      function submitTrade(q) {
        console.log(q)
      }

      function priceUpdate() {
        console.log("update")
      }

    }
})();
