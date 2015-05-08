angular.module('app')
     .filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    }
});

