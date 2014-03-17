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
