'use strict';

/* Controllers */
  // signin controller
app.controller('FavoritesCtrl', ['$scope','$rootScope', '$firebase', 'simpleLogin', '$location', function ($scope, $rootScope, $firebase, simpleLogin, $location) {
    
    var ref = new Firebase("https://torid-fire-4332.firebaseio.com"); // shows
    var showsSync = $firebase(ref.child("shows"));
    $scope.shows = showsSync.$asArray();

    simpleLogin.getUser().then(function (user) {

        var FavoritesSync = $firebase(ref.child("users").child(user.uid).child("favorites"));
        $scope.UserFavorites = FavoritesSync.$asObject(); // e.g. show1 = true

        $scope.UserFavorites.$loaded(function () {

            var showsArr;
            showsArr = $scope.shows[0];

            $scope.currentlyFavorited = [];  // Array

            // creates $scope.currentlyFavorited on page load
            angular.forEach(showsArr, function(value, key){
                if ($scope.UserFavorites[value.properties.id] === true){
                    $scope.currentlyFavorited.push(showsArr[value, key]);  
                }
            });

            var calculateLength = function () {
            $rootScope.FavoritesLength = 0;
            angular.forEach($scope.UserFavorites, function(value, key){
                if ($scope.UserFavorites[key] === true){
                    $rootScope.FavoritesLength ++;
                }
                //console.log($scope.FavoritesLength);
            });
            }

            calculateLength();

            $scope.toggleStarred = function (favorite) {

                if ($scope.UserFavorites[favorite.properties.id] === true) {
                    $scope.UserFavorites[favorite.properties.id] = false;

                } else if ($scope.UserFavorites.$value === undefined || null) {
                    $scope.UserFavorites[favorite.properties.id] = true;

                } else {
                    $scope.UserFavorites[favorite.properties.id] = true;
                }

                //console.log($scope.UserFavorites)
                calculateLength();

                $scope.UserFavorites.$save();
            }; // toggleStarred 
            
        }) // loaded

    }) //user promise

    // soundcloud streaming stuff

    $scope.favorite = {};        

    $scope.streamTrack = function (favorite) {
        
        SC.stream(favorite.properties.stream_url, function (sound) {
            $scope.sound = sound;
            soundManager.stopAll();
            sound.play();
        });

        favorite.visible = false;
    };

    $scope.pauseTrack = function (favorite) {
        $scope.sound.pause();
        favorite.visible = true;
    };
     



  }])
;
