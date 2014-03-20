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

      $scope.regions = [{'name': 'Europe', 'value': 'eu'}, {'name': 'United States', 'value': 'us'}];
      $scope.region  = ConfigManager.get('region');
      $scope.$watch('region', function() {
        ConfigManager.set('region', $scope.region);

        ApiClient.findRealms($scope.region).then(function(realms) {
          $scope.realms = realms.realms;

          $scope.doSearch = function() {
            console.log($scope.region);
            var characterPromise = ApiClient.findCharacter(
              $scope.region,
              $scope.formData.realm,
              $scope.formData.name
            );

            characterPromise.then(function(response) {
              $scope.response = response;
            });
          };
        });
      });
    }
  ])
  .controller('MyCtrl2', [function() {

  }]);
