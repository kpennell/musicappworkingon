'use strict';

/* Filters */
angular.module('app')
     .filter('upComing', ['$parse',
     function($parse) {
       return function(items, field, days) {
         var timeStart = +Date.now() + ((days - .8) * 86400000);  // This needs finessing.
         var timeEnd = +Date.now() + ((days + .3) * 86400000); // 1 day in ms
         var fieldFn = $parse(field);
         return (items || []).filter(function(item) {
           var field = +new Date(fieldFn(item));
           return (field > timeStart && field < timeEnd);
         });
       };
     }
   ]);





/* Working upComing filter

angular.module('app')
     .filter('upComing', ['$parse',
     function($parse) {
       return function(items, field, days) {
         var timeStart = +Date.now();    // Today in millisecond
         var timeEnd = +Date.now() + (days * 86400000); // 1 day in ms
         var fieldFn = $parse(field);
         return (items || []).filter(function(item) {
           var field = +new Date(fieldFn(item));
           return (field > timeStart && field < timeEnd);
         });
       };
     }
   ]);


*/