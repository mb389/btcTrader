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

          if (type === 'buy') {
            lots.push({t: new Date(), px, q}); //track lots
          }
          else {
            q*=-1;
            //TODO: short lot tracking
          }
          vm.trades.push({t: new Date(), px, q}); //track trade history
          vm.position += q;
          recalcPNL();
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
            recalcPNL();
          } else {
            console.log("no new price available")
          }
        })
        .catch(err => console.log(err))
      }

      function recalcPNL() {
        var costBasis=0;
        lots.forEach(lot => {
          costBasis+=lot.px*lot.q;
        })
        vm.unrealPNL = vm.position * vm.spot - costBasis;
      }

    }
})();
