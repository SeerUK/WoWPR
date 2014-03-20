'use strict';

/* Controllers */

angular.module('wowpr.controllers', [])
  .controller('HomeCtrl', ['$scope', '$q', 'ApiClient', 'ConfigManager',
    function($scope, $q, ApiClient, ConfigManager) {
      // Set up default config values here, other pages can redirect back to here
      // if they don't have sufficient data
      if ( ! ConfigManager.get('region')) {
        console.log('Setting region config.');
        ConfigManager.set('region', 'eu');
      }

      var region = ConfigManager.get('region');

      ApiClient.findRealms(region).then(function(realms) {
        $scope.realms = realms.realms;

        $scope.doSearch = function() {
          var characterPromise = ApiClient.findCharacter(
            region,
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
