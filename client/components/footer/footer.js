(function() {
  angular
    .module('mainApp')
    .directive('footer', footer);

    function footer() {
      return {
          templateUrl: 'components/footer/footer.html'
        }
    }
})();
