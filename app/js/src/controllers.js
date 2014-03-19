'use strict';

/* Controllers */

angular.module('wowpr.controllers', [])
  .controller('HomeCtrl', ['$scope', 'ApiClient',
    function($scope, ApiClient) {
      var characterPromise = ApiClient.findCharacter('eu', 'burning-legion', 'sylnai');
      characterPromise.then(function(character) {
        $scope.character = character;

        $scope.doSomething = function() {
          console.log('Doing something');
        };
      });

    }
  ])
  .controller('MyCtrl2', [function() {

  }]);
