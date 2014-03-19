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
