var ApiClient = function($http, $q) {
  /**
   * Perform a request
   *
   * @return object
   */
  var request = function(region, uri) {
    var deferred = $q.defer();

    $http.get('proxy.php?region=' + region + '&uri=' + uri)
      .success(function(data, status, headers, config) {
        deferred.resolve({
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      })
      .error(function(data, status, headers, config) {
        deferred.reject({
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });

    return deferred.promise;
  };


  return {
    /**
     * Find a character
     *
     * @param  string region
     * @param  string realm
     * @param  string name
     * @return deferred
     */
    findCharacter: function(region, realm, name) {
      return request(
        region,
        '/api/wow/character/' + realm + '/' + name
      );
    },

    /**
     * Find all realms
     *
     * @param  string region
     * @return deferred
     */
    findRealms: function(region) {
      return request(
        region,
        '/api/wow/realm/status'
      );
    }
  }
};

var ConfigManager = function(StorageEngine) {
  /**
   * @type Object
   */
  var keys = StorageEngine.get('wowpr.config') || {};

  return {
    /**
     * Get a config value by its key
     *
     * @param  string key
     * @return string
     */
    get: function(key) {
      return keys[key] || false;
    },

    /**
     * Set a config value by its key
     *
     * @param  string key
     * @param  string value
     * @return ConfigManager
     */
    set: function(key, value) {
      keys[key] = value;

      StorageEngine.set('wowpr.config', keys);

      return this;
    }
  }
};

var StorageEngine = function($cookieStore) {
  /**
   * Check if local storage is supported
   *
   * @return Boolean
   */
  var isLocalStorageAllowed = function() {
    return typeof(Storage) === "undefined"
      ? false
      : true;
  };

  return {
    /**
     * Get a storage value by its key
     *
     * @param  string key
     * @return string
     */
    get: function(key) {
      return isLocalStorageAllowed
        ? JSON.parse(localStorage.getItem(key))
        : $cookieStore.get(key);
    },

    /**
     * Set a storage value by its key
     *
     * @param  string key
     * @param  string value
     * @return ConfigManager
     */
    set: function(key, value) {
      isLocalStorageAllowed
        ? localStorage.setItem(key, JSON.stringify(value))
        : $cookieStore.put(key, value);

        return this;
    },

    /**
     * Unset a storage value by its key
     *
     * @param  string key
     * @return ConfigManager
     */
    unset: function(key) {
      isLocalStorageAllowed
        ? localStorage.removeItem(key)
        : $cookieStore.remove(key);

      return this;
    }
  }
};

'use strict';


// Declare app level module which depends on filters, and services
angular.module('wowpr', [
  'ngAnimate',
  'ngCookies',
  'ngRoute',
  'wowpr.filters',
  'wowpr.services',
  'wowpr.directives',
  'wowpr.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);

'use strict';

/* Controllers */

angular.module('wowpr.controllers', [])
  .controller('HomeCtrl', ['$scope', '$q', 'ApiClient', 'ConfigManager',
    function($scope, $q, ApiClient, ConfigManager) {
      // Set up default config values here, other pages can redirect back to here
      // if they don't have sufficient data
      if ( ! ConfigManager.get('region')) {
        ConfigManager.set('region', 'eu');
      }

      var action = {};
      var els    = {};

      els.logo    = angular.element(document.getElementById('logo'));
      els.spinner = angular.element(document.getElementById('spinner'));

      action.showSpinner = function() {
        els.logo.addClass('hide');
        els.spinner.addClass('active');
      };

      action.hideSpinner = function() {
        els.logo.removeClass('hide');
        els.spinner.removeClass('active');
      };

      action.regionChange = function() {
        // Save region for future visits
        ConfigManager.set('region', $scope.region);

        action.showSpinner();
        // Fetch realms for given region
        ApiClient.findRealms($scope.region).then(function(realms) {

          action.hideSpinner();

          $scope.realms = realms.data.realms;

          $scope.doSearch = function() {
            action.showSpinner();
            // action.clearErrors();

            ApiClient.findCharacter(
              $scope.region,
              $scope.formData.realm,
              $scope.formData.name
            ).then(function(response) {
              action.hideSpinner();
              $scope.response = response.data;
            }, function(response) {
              action.hideSpinner();

              console.error('Errors have occurred');
              console.error(response.data.reason);

              // TODO: Handle erroneous responses, i.e. if a character doesn't exist
              // action.addErrors();
            });
          };
        });
      };

      $scope.regions = [
        { 'name': 'Europe', 'value': 'eu' },
        { 'name': 'United States', 'value': 'us' },
        { 'name': 'Korea', 'value': 'kr' },
        { 'name': 'Taiwan', 'value': 'tw' }
      ];
      $scope.region  = ConfigManager.get('region');
      $scope.$watch('region', action.regionChange);
    }
  ])
  .controller('MyCtrl2', [function() {

  }]);

'use strict';

/* Directives */

angular.module('wowpr.directives', [])
  .directive('asideMenuButton', [function() {
    return {
      restrict: 'A',
      link: function(scope, $el, attrs) {
        var $aside = angular.element(document.getElementById(attrs.parent));
        var $body  = angular.element(document.getElementsByTagName('body'));

        var _hide = function() {
          $aside.removeClass('active');
        };

        var _show = function() {
          $aside.addClass('active');
        };

        $body.on('click', function(e) {
          if ($aside.hasClass('active')) {
            _hide();
          }
        });

        $aside.on('click', function(e) {
          e.stopPropagation();
        });

        $el.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          if ($aside.hasClass('active')) {
            _hide();
          } else {
            _show();
          }
        });
      }
    };
  }]);

'use strict';

/* Filters */

angular.module('wowpr.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);

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
  .service('StorageEngine', ['$cookieStore', StorageEngine])
;
