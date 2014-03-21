'use strict';

/* Services */


angular.module('wowpr.services', [])
  .service('Test', [function() {
    return {
      test: 'test'
    }
  }])
  .service('ApiClient', ['$http', '$q', ApiClient])
  .service('ConfigManager', ['StorageEngine', ConfigManager])
  .service('SpinnerHelper', [SpinnerHelper])
  .service('StorageEngine', ['$cookieStore', StorageEngine])
;
