'use strict';

/* Services */


angular.module('wowpr.services', [])
  .service('Test', [function() {
    return {
        foo: function() {
            return 'bar';
        }
    };
  }]);
