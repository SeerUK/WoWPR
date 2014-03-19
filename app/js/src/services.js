'use strict';

/* Services */


angular.module('wowpr.services', [])
  .service('Test', [function() {
    return {
      test: 'test'
    }
  }])
  .service('ApiClient', ['$http', '$q', ApiClient]);
