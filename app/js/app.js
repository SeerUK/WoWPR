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
        deferred.resolve(data);
      })
      .error(function(data, status, headers, config) {
        return false;
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

var ConfigManager = function() {
  /**
   * @type Object
   */
  var keys = {};

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

      return this;
    }
  }
};

'use strict';


// Declare app level module which depends on filters, and services
angular.module('wowpr', [
  'ngAnimate',
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
      var region = ConfigManager.get('region');

      console.log(region);

      ApiClient.findRealms('eu').then(function(realms) {
        $scope.realms = realms.realms;

        $scope.doSearch = function() {
          var characterPromise = ApiClient.findCharacter(
            'eu',
            $scope.formData.realm,
            $scope.formData.name
          );

          characterPromise.then(function(response) {
            $scope.response = response;
          });
        };
      });
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
  .service('ConfigManager', [ConfigManager])
;
