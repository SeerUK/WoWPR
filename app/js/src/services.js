'use strict';

/* Services */


angular.module('wowpr.services', [])
  .service('ApiClient', ['$http', '$q', ApiClient])
  .service('CharacterDataHelper', [CharacterDataHelper])
  .service('ConfigManager', ['StorageEngine', ConfigManager])
  .service('SpinnerHelper', [SpinnerHelper])
  .service('StorageEngine', ['$cookieStore', StorageEngine])
;
