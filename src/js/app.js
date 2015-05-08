'use strict';


angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'ui.load',
    'ui.jq',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'firebase',
    'simpleLogin',
    'changeEmail',
    'leaflet-directive'

])

  .run(['simpleLogin', function(simpleLogin) {
    //console.log('run'); //debug
    simpleLogin.getUser();
  }])


/*
  .run(['simpleLogin', function(simpleLogin) {
    //console.log('run'); //debug
    simpleLogin.getUser();
  }]);
*/