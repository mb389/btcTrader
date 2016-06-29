(function() {
  angular
    .module('mainApp')
    .controller(DashCtrl);

    DashCtrl.$inject = ['DashFactory']
    function DashCtrl(DashFactory) {

      return {};


    }
})();
