'use strict';


app.controller('SignInCtrl', ['$scope', 'simpleLogin', '$state','$firebaseSimpleLogin','$rootScope',
 function($scope, simpleLogin, $state, $firebaseSimpleLogin,$rootScope) {

    $scope.email = null;
    $scope.pass = null;
    $scope.confirm = null;
    $scope.createMode = false;


    var firebaseRef = new Firebase("https://torid-fire-4332.firebaseio.com");
  // Create a Firebase Simple Login object
    $scope.auth = $firebaseSimpleLogin(firebaseRef);
  // Initially set no user to be logged in
    $scope.user = null;
  // Logs a user in with inputted provider
    
    $scope.loginFacebook = function(provider) {
    $scope.auth.$login(provider)
    
  };

   // Upon successful login, set the user object
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    $scope.user = user;
    console.log($scope.user);
    $state.go('app.vibesample'); 
  });
  // Upon successful logout, reset the user object
  $rootScope.$on("$firebaseSimpleLogin:logout", function(event) {
    $scope.user = null;
  });
  // Log any login-related errors to the console
  $rootScope.$on("$firebaseSimpleLogin:error", function(event, error) {
    console.log("Error logging user in: ", error);
  });


    $scope.loginEmail = function (email, pass) {
        $scope.err = null;
        simpleLogin.login(email, pass)
            .then(function ( /* user */ ) {
            $state.go('app.vibesample'); 
        }, function (err) {
            $scope.err = errMessage(err);
        });
    };

   

    $scope.createAccount = function () {
        $scope.err = null;
        if (assertValidAccountProps()) {
            simpleLogin.createAccount($scope.email, $scope.pass)
                .then(function ( /* user */ ) {
                $state.go('app.signin');
            }, function (err) {
                $scope.err = errMessage(err);
            });
        }
    };

    function assertValidAccountProps() {
        if (!$scope.email) {
            $scope.err = 'Please enter an email address';
        } else if (!$scope.pass || !$scope.confirm) {
            $scope.err = 'Please enter a password';
        } else if ($scope.createMode && $scope.pass !== $scope.confirm) {
            $scope.err = 'Passwords do not match';
        }
        return !$scope.err;
    }

    function errMessage(err) {
        return angular.isObject(err) && err.code ? err.code : err + '';
    }


    $scope.sendPasswordResetEmail = function(email){   // need to inject the right service to make this work
        var dataRef = new Firebase("https://torid-fire-4332.firebaseio.com");
        $scope.loginObj = $firebaseSimpleLogin(dataRef);

        $scope.loginObj.$sendPasswordResetEmail(email).then(function(){
            // show flash notification that email was sent
            $scope.resetForm = false;
            $scope.resetEmail = '';
            //$scope.notifications.push('Temporary password sent! Try logging in')

            $state.go('app.vibesample'); 
        }, function(err){

            if (err.code === 'INVALID_EMAIL'){
                $scope.errors.push('There is no account associated with that email')
                $scope.resetForm = false;
            } else {
                $scope.errors.push('Something went wrong..')
            }
        })
    }


}])
;

