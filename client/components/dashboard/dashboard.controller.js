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

      function submitTrade(q,type) { //TODO: finish lot tracking
        console.log(q,type)
        DashFactory.getTradePx(type)
        .then(px => {
          vm.pxStream[type].push([Date.now(),px]) //track prices

          if (type === 'buy') {
            vm.trades.push({t: new Date(), px, q}); //track trade history
            lots.push({t: new Date(), px, q}); //track lots
            vm.position += q;
          }
          else {
            vm.trades.push({t: new Date(), px, q: -q}); //track trade history
            vm.position -= q;
          }
          updateChart();
          recalcPNL();
        })
        .catch(err => console.log(err))
      }

      setInterval(priceUpdate,10000)
      function priceUpdate() {
        console.log("updating...")
        DashFactory.getTradePx('spot')
        .then(px => {
          if (Number(px) !== vm.spot) {
            vm.pxStream.spot.push([Date.now(),px])
            vm.spot = px;
            console.log(vm.pxStream)
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
            forceY: [vm.spot-25,vm.spot+25]
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
