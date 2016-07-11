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

      function submitTrade(q) {
        if (q>0) {
         DashFactory.getTradePx('buy')
         .then(px => processTrade(Number(q),Number(px)))
         .catch(() => {
           console.log("falling back to stale buy px")
           processTrade(Number(q),vm.pxStream.buy[vm.pxStream.buy.length-1])
         })
       } else {
         DashFactory.getTradePx('sell')
         .then(px => processTrade(Number(q),Number(px)))
         .catch(() => {
           console.log("falling back to stale sell px")
           processTrade(Number(q),vm.pxStream.sell[vm.pxStream.sell.length-1])
         })
       }
      }

      function processTrade(q,px) {
      var newTrade = {t: new Date(), px, q};
      vm.trades.push(angular.extend({},newTrade))

      if (q > 0) {
        vm.pxStream.buy.push(px)
        console.log("buying ",q," @ ",px)

        if (vm.position < 0) { //closing short
          var amtBot = q;
          while (amtBot > 0) {
            if (amtBot >= Math.abs(lots[lots.length-1].q)) {
              var lastLot=lots.pop()
              amtBot+=lastLot.q;
              vm.realPNL+=(lastLot.q*px-lastLot.q*lastLot.px)
              console.log("realPNL impact ",(lastLot.q*px-lastLot.q*lastLot.px))
            } else {
              lots[lots.length-1].q+=amtBot;
              vm.realPNL+=(amtBot*px-amtBot*lots[lots.length-1].px)
              console.log("realPNL impact ",(amtBot*px-amtBot*lots[lots.length-1].px))
              amtBot=0;
            }
            if (!lots.length) {
              lots.push({q: amtBot, px});
              break;
            }
          }
        } else lots.push(angular.extend({},newTrade));
      } else {
        console.log("selling ",q," @ ",px)
        vm.pxStream.sell.push(px)

        var amtSold = Math.abs(q);
        while (amtSold > 0) {
          if (amtSold >= lots[lots.length-1].q) {
            var lastLot=lots.pop()
            amtSold-=lastLot.q;
            vm.realPNL+=(lastLot.q*px-lastLot.q*lastLot.px)
            console.log("realPNL impact",(lastLot.q*px-lastLot.q*lastLot.px))
          } else {
            lots[lots.length-1].q-=amtSold;
            vm.realPNL+=(amtSold*px-amtSold*lots[lots.length-1].px)
            console.log("realPNL impact", (amtSold*px-amtSold*lots[lots.length-1].px))
            amtSold=0;
          }
          if (!lots.length) {
            console.log("net short!")
            lots.push({q: -amtSold, px})
            break;
          }
        }

      }
      vm.position += q;
      vm.data[0].values.push({x: Date.now(), y: vm.position}) //update graph
      vm.data[1].values.push({x: Date.now(), y: vm.spot}) //update graph
      console.log("lots",lots)
      recalcPNL();
    }

      setInterval(priceUpdate,10000) //refresh price every 10s

      function priceUpdate() {
        console.log("updating...")
        DashFactory.getTradePx('spot')
        .then(px => {
          if (px !== vm.spot) {
            vm.pxStream.spot.push([Date.now(),px])
            vm.spot = px;
            console.log("price stream: ",vm.pxStream)
            updateChart();
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

      function updateChart() {
        vm.data[0].values.push({x: Date.now(), y: vm.position}) //update graph
        vm.data[1].values.push({x: Date.now(), y: vm.spot}) //update graph
      }

      //chart data
      //TODO: move chart out to directive
      vm.data = [
        {
          "key" : "Quantity" ,
          "bar": true,
          "values" : [[Date.now(), 0] ]
        },
        {
          "key" : "BTC Price" ,
          "values" : [[Date.now(), vm.spot]]
        }
      ].map(function(series) {
          series.values = series.values.map(function(d) { return { x: d[0], y: d[1] } });
          return series;
        });

      vm.options = {
        chart: {
          type: 'linePlusBarChart',
          height: 500,
          margin: {
              top: 30,
              right: 75,
              bottom: 50,
              left: 75
          },
          bars: {
              forceY: [-50,100]
          },
          lines: {
            forceY: [vm.spot-15,vm.spot+15]
          },
          color: ['grey', 'darkred'],
          x: function(d,i) { return i },
          focusEnable: false,
          xAxis: {
              axisLabel: 'X Axis',
              tickFormat: function(d) {
                var dx = vm.data[1].values[d] && vm.data[1].values[d].x || 0;
                if (dx > 0) {
                    return d3.time.format('%X')(new Date(dx))
                }
                return null;
              }
          },
          y1Axis: {
              axisLabel: 'Quantity',
              tickFormat: function(d){
                return d3.format(',f')(d);
              },
              axisLabelDistance: 12
          },
          y2Axis: {
              axisLabel: 'Price',
              tickFormat: function(d) {
                return '$' + d3.format(',.2f')(d)
            }
          }
        }
      }
}

})();
