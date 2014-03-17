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
  $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'Home'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);

'use strict';

/* Controllers */

angular.module('wowpr.controllers', [])
  .controller('Home', ['$scope', 'Test',
    function($scope, Test) {
      console.log(Test.foo());

      $scope.test = { test: Test.foo() };
    }
  ])
  .controller('MyCtrl2', [function() {

  }]);

'use strict';

/* Directives */


angular.module('wowpr.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
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
        foo: function() {
            return 'bar';
        }
    };
  }]);
