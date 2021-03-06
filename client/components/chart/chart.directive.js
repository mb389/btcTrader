(function() {
  angular
    .module('mainApp')
    .directive('chart',chart)

  function chart() {
    var directive = {
      restrict: 'E',
      scope: {
        data: '='
      },
      link,
      template: `<nvd3 options="options" data="data"></nvd3>`
    }
    return directive;

    function link(vm) {
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
            forceY: [vm.$parent.vm.spot-15,vm.$parent.vm.spot+15]
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

  }

})();
