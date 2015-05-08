'use strict';

/* Controllers */

app.controller('ShowsCtrl', ['$scope', '$rootScope' ,'$state', '$firebase', '$filter', 'simpleLogin','leafletData','Player',
function($scope, $rootScope, $state, $firebase, $filter, simpleLogin, leafletData, Player) {
    var ref = new Firebase("https://torid-fire-4332.firebaseio.com");
    var showsSync = $firebase(ref.child("shows"));
    $scope.shows = showsSync.$asArray();
    $scope.listShows = [];
    $scope.filteredShows = [];
    $scope.daysAhead = .5;



    $scope.cityoptions = [
    'SF',
    'Denver (coming soon)',
    'NYC (coming soon)'
  ];

    //$scope.dayofWeekSelected = null;

    $scope.day = Date.now();

    $scope.selectDay = function(day) {
        var todaysDateinMS = Date.now();
        $scope.day = day;

        $scope.daysAhead = (($scope.day - todaysDateinMS) / 86400000);
        //console.log('approx days ahead of now ' + $scope.daysAhead);
        // $scope.daysAhead needs to be a number 1-7 so that it can feed into filter
    }


    //Date.now() + (2 * 86400000)

    $scope.days = [
    ($scope.day + (0 * 86400000)),
    ($scope.day + (1 * 86400000)),
    ($scope.day + (2 * 86400000)),
    ($scope.day + (3 * 86400000)),
    ($scope.day + (4 * 86400000)),
    ($scope.day + (5 * 86400000)),
    ($scope.day + (6 * 86400000)),
  ];

    $scope.radioModel = 'Right';

     $scope.checkModel = {
    left: false,
    middle: false,
    right: true
    };

    
    // checkIfLoggedIn gets called by the favoriting buttons.  Checks if the user is logged in or not.  If not, redirects to signup page
      $scope.checkIfLoggedIn = function (show) {
        if (simpleLogin.user === null){
            $state.go('app.signin');
        }
        else {
            $scope.toggleStarred(show);
        }
    };


    //$scope.dayFilterOptions = [.5, 3, 7];

    simpleLogin.getUser().then(function (user) {

        var loggedInUserFavoritesSync = $firebase(ref.child("users").child(user.uid).child("favorites"));

        $scope.loggedInUserFavorites = loggedInUserFavoritesSync.$asObject();

        $scope.loggedInUserFavorites.$loaded(function () {

            var calculateLength = function () {
            $rootScope.FavoritesLength = 0;  // rootScope so header can access 
            angular.forEach($scope.loggedInUserFavorites, function(value, key){
            if ($scope.loggedInUserFavorites[key] === true){
                $rootScope.FavoritesLength ++;
            }
            });
            }
    
            calculateLength();

            $scope.toggleStarred = function (show) {


                if ($scope.loggedInUserFavorites[show.properties.id] === true) {
                    $scope.loggedInUserFavorites[show.properties.id] = false;

                } else if ($scope.loggedInUserFavorites.$value === undefined || null) {
                    $scope.loggedInUserFavorites[show.properties.id] = true;

                } else {
                    $scope.loggedInUserFavorites[show.properties.id] = true;
                }

                console.log($scope.loggedInUserFavorites) //.replace( /^\D+/g, '');
            

                $scope.loggedInUserFavorites.$save();
                calculateLength();
            }; // toggleStarred
        }) // Loaded
    }) // User
    


    $scope.shows.$loaded(function () {
       
        // Left Sidebar data

        $scope.listShows = $scope.shows[0];

        $scope.$watch('daysAhead', function () {
            $scope.filteredShows = $filter('upComing')($scope.listShows, 'properties.date', $scope.daysAhead);

            angular.extend($scope, { // Map data
                geojson: {
                    data: $scope.filteredShows,
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(feature.properties.artist + '&nbsp;&middot;&nbsp;' + feature.properties.venue_name);
                        layer.setIcon(defaultMarker);
                        layer.on({
                            mouseover: pointMouseover,
                            mouseout: pointMouseout
                        });
                        layers[feature.properties.id] = layer;
                    }
                }        
            });
        }); // watch
    }); // loaded

 // Experimental Player with service

    $scope.player = Player;
    //console.log($scope.player);

    $scope.$on('statusChanged', function () {
      if(!$scope.$$phase) {
        $scope.$digest();
      }
    });


    // will change styling if active track is playing

    $scope.$watch('player.currentTrack.id', function () {
    angular.element('.tracks li.playing').removeClass('playing');

      if (Player.currentTrack && Player.currentTrack.id) {
        angular.element('#track-' + Player.currentTrack.id).addClass('playing');
      }
    });

    
    $scope.setPosition = function(e) {
      var positionPercent = (e.pageX - e.currentTarget.offsetLeft) / e.currentTarget.offsetWidth;
      Player.setPosition(positionPercent);
    };




// end of experimental player





    

    // map
       angular.extend($scope, {
    center: {
        lat: 37.7577,
        lng: -122.4376,
        zoom: 12,
        scrollWheelZoom:'center'
    },
    defaults: {
        tileLayer: 'http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3Blbm5lbGwiLCJhIjoid3QxaFNMTSJ9.5HjAo-fmMghcHGeCMOMheg',
        maxZoom: 16,
        path: {
            weight: 2,
            color: '#800000',
            opacity: 1
        }
    }
    });
    
    var defaultMarker = L.icon({
        iconUrl: 'img/marker-icon.png',
        shadowUrl: 'img/marker-shadow.png',
        popupAnchor: [1, -24],
        iconAnchor: [13, 27]
    });

    var mouseoverMarker = L.icon({
        iconUrl: 'img/marker-green.png',
        shadowUrl: 'img/marker-shadow.png',
        popupAnchor: [1, -24],
        iconAnchor: [13, 27]
    });

    var layers = {};

    $scope.hoveritem = {};

    function pointMouseover(leafletEvent) {
        var layer = leafletEvent.target;
        layer.setIcon(mouseoverMarker);

        $scope.$apply(function () {
            $scope.hoveritem = ((layer.feature.properties.id).replace(/^\D+/g, '')); // regex to pull number out of string, whoah!
            //console.log((layer.feature.properties.id).replace(/^\D+/g, ''));
            //console.log($scope.hoveritem);
        })
    }

    function pointMouseout(leafletEvent) {
        var layer = leafletEvent.target;
        layer.setIcon(defaultMarker);

        $scope.$apply(function () {
            $scope.hoveritem = {};
        })
    }

    $scope.menuMouse = function (show) {
        var layer = layers[show.properties.id];
        //console.log(layer);
        layer.setIcon(mouseoverMarker);
    }

    $scope.menuMouseout = function (show) {
        var layer = layers[show.properties.id];
        layer.setIcon(defaultMarker);
    }

    // trying music player 




}])
;



/* Mostly working stream_track

$scope.sound = {};
    $scope.player = {};       

    $scope.streamTrack = function (show) {
        
        SC.stream(show.properties.stream_url, function (sound) {
            $scope.sound = sound;
            //console.log(sound);
            soundManager.stopAll();

            
            sound.play({
                whileplaying: function (){
                    $scope.player.duration = Math.floor(this.durationEstimate / 1000);
                    $scope.player.position = Math.floor(this.position / 1000);
                    $scope.player.progress = (this.position / this.durationEstimate) * 100;
                    $rootScope.$broadcast('statusChanged', true);

                    console.log($scope.player);
                },
                setPosition: function (percent) {
                    sound.setPosition(percent * this.sound.duration);
                 }
            });

        });

        show.visible = false;
    };

    

    $scope.$on('statusChanged', function () {
      if(!$scope.$$phase) {
        $scope.$digest();
      }
    });

     $scope.setPosition = function(e) {
      var positionPercent = (e.pageX - e.currentTarget.offsetLeft) / e.currentTarget.offsetWidth;
      console.log(positionPercent);
      //$scope.player.setPosition(positionPercent);
    };


    $scope.pauseTrack = function (show) {
        $scope.sound.pause();
        show.visible = true;
    };


*/