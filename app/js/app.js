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
  $routeProvider.when('/character/:realm/:name', {templateUrl: 'partials/character.html', controller: 'CharacterCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);

'use strict';

/* Controllers */

angular.module('wowpr.controllers', [])
  /**
   * Home screen controller
   * @route /
   */
  .controller('HomeCtrl', ['$scope', '$q', '$http', '$location', '$templateCache', 'ApiClient', 'ConfigManager',
    function($scope, $q, $http, $location, $templateCache, ApiClient, ConfigManager) {
      // Set up default config values here, other pages can redirect back to here
      // if they don't have sufficient data
      if ( ! ConfigManager.get('region')) {
        ConfigManager.set('region', 'eu');
      }

      var action = {};
      var els    = {};

      els.logo    = angular.element(document.getElementById('logo'));
      els.spinner = angular.element(document.getElementById('spinner'));

      action.hideSpinner = function() {
        els.logo.removeClass('hide');
        els.spinner.removeClass('active');
      };

      action.showSpinner = function() {
        els.logo.addClass('hide');
        els.spinner.addClass('active');
      };

      action.regionChange = function() {
        // Save region for future visits
        ConfigManager.set('region', $scope.region);

        // Fetch realms for given region
        action.showSpinner();
        ApiClient.findRealms($scope.region).then(function(realms) {
          action.hideSpinner();

          $scope.realms = realms.data.realms;

          var nameTimeout;
          var character;
          $scope.$watch('formData.name', function() {
            action.hideSpinner();
            clearTimeout(nameTimeout);
            nameTimeout = setTimeout(function() {
              action.showSpinner();
              ApiClient.findCharacter(
                $scope.region,
                $scope.formData.realm,
                $scope.formData.name
              ).then(function(response) {
                action.hideSpinner();

                response.data.profileMain = response.data.thumbnail.replace("avatar.jpg", "profilemain.jpg");
                $scope.character = response.data;
              }, function() {
                action.hideSpinner();
              });
            }, 1500);
          });

          $scope.doSearch = function() {

            // Clear any existing errors
            $scope.error = null;

            action.showSpinner();
            ApiClient.findCharacter(
              $scope.region,
              $scope.formData.realm,
              $scope.formData.name
            ).then(
              // Successfully found character
              function(response) {
                action.hideSpinner();
                $scope.response = response.data;

                $location.path('/character/' + $scope.formData.realm + '/' + $scope.formData.name);
              },

              // Error finding character
              function(response) {
                action.hideSpinner();

                $scope.error = response.data.reason;
              }
            );
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

      // Cache other templates
      $http.get('partials/character.html', { cache: $templateCache });
    }
  ])

  /**
   * Character screen controller
   * @route /character/:realm/:name
   */
  .controller('CharacterCtrl', ['$scope', '$http', '$location', '$routeParams', '$templateCache', 'ApiClient', 'ConfigManager',
    function($scope, $http, $location, $routeParams, $templateCache, ApiClient, ConfigManager) {
      // If config is not set up, send to homepage to get it set up properly
      if ( ! ConfigManager.get('region')) {
        $location.path('/');
      }

      // TODO: Start - Refactor this
      var action = {};
      var els    = {};


      els.logo    = angular.element(document.getElementById('logo'));
      els.spinner = angular.element(document.getElementById('spinner'));

      action.hideSpinner = function() {
        els.logo.removeClass('hide');
        els.spinner.removeClass('active');
      };

      action.showSpinner = function() {
        els.logo.addClass('hide');
        els.spinner.addClass('active');
      };
      // TODO: End - Refactor this

      action.region = ConfigManager.get('region');
      action.showSpinner();

      ApiClient.findCharacter(action.region, $routeParams.realm, $routeParams.name).then(
        function (response) {
          action.hideSpinner();
          console.log(response.data);
          $scope.character = response.data;
        },
        function (response) {
          action.hideSpinner();
          $scope.error = response.data.reason;
        }
      );

      // Cache other templates
      $http.get('partials/home.html', { cache: $templateCache });
    }
  ]);

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
