'use strict';

/* Controllers */
  // signin controller
app.controller('ctrlname', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;

    };
  }])
;