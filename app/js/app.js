var ApiClient = function(injected) {
  var constructed = injected;

  return {
    name: 'ApiClient',
    getConstructed: function() {
      return constructed;
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
  .controller('HomeCtrl', ['$scope', 'ApiClient',
    function($scope, ApiClient) {
      console.log(ApiClient.getConstructed());

      $scope.test = { test: ApiClient.name };

      this.doSomething = function() {
        console.log('Doing something');
      };
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
          $body.removeClass('aside-active');

          if ($aside.hasClass('left')) {
            $body.removeClass('active');
            $body.removeClass('left');
          }

          if ($aside.hasClass('right')) {
            $body.removeClass('active');
            $body.removeClass('right');
          }
        };

        var _show = function() {
          $aside.addClass('active');
          $body.addClass('aside-active');

          if ($aside.hasClass('left')) {
            $body.addClass('left');
            $body.addClass('active');
          }

          if ($aside.hasClass('right')) {
            $body.addClass('right');
            $body.addClass('active');
          }
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
  .service('ApiClient', ['Test', ApiClient]);
