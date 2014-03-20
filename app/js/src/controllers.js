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

        // TODO: Begin region spinner
        ApiClient.findRealms($scope.region).then(function(realms) {
          // TODO: End region spinner
          $scope.realms = realms.realms;

          $scope.doSearch = function() {
            var characterPromise = ApiClient.findCharacter(
              $scope.region,
              $scope.formData.realm,
              $scope.formData.name
            );

            // TODO: Refactor this code, it's a little messier than it has to be
            // TODO: Begin character pull spinner
            characterPromise.then(function(response) {
              // TODO: End character pull spinner
              // TODO: Handle erroneous responses, i.e. if a character doesn't exist
              $scope.response = response;
            });
          };
        });
      });
    }
  ])
  .controller('MyCtrl2', [function() {

  }]);
