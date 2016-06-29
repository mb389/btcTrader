(function() {
  angular
    .module('mainApp')
    .controller('DashCtrl',DashCtrl);

    DashCtrl.$inject = ['DashFactory','btcSpot']
    function DashCtrl(DashFactory,btcSpot) {

      var vm = this;
      vm.spot = btcSpot;
      vm.tradeQuantity = 5; //default quantity
      vm.position = 0;
      vm.trades = [];
      vm.pxStream = {
        buy: [],
        sell: [],
        spot: [[Date.now(),btcSpot]]
      }
      vm.realPNL = 0;
      vm.unrealPNL = 0;
      vm.submitTrade = submitTrade;
      vm.priceUpdate = priceUpdate;

      var lots = [];

      /////////////////////////////

      function submitTrade(q,type) {
        console.log(q,type)
        DashFactory.getTradePx(type)
        .then(px => {
          vm.pxStream[type].push([Date.now(),px]) //track prices
          if (type === 'buy') vm.position += q;
          else vm.position -= q;
        })
        .catch(err => console.log(err))

      }

      // setInterval(priceUpdate,10000)
      function priceUpdate() {
        console.log("update")
        DashFactory.getTradePx('spot')
        .then(px => {
          if (Number(px) !== vm.spot) {
            vm.pxStream.spot.push([Date.now(),px])
            vm.spot = px;
            console.log(vm.pxStream)
          } else {
            console.log("no new price available")
          }
        })
        .catch(err => console.log(err))
      }

    }
})();
