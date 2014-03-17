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
