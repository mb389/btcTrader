(function() {
  angular
    .module('mainApp')
    .directive('chart',chart)

  function chart() {
    var directive = {
      restrict: 'E',
      link,
      template: `<nvd3 options="options" data="data"></nvd3>`
    }
    return directive;

    function link(vm,attr,ctrl) {


    }
  }

})();
