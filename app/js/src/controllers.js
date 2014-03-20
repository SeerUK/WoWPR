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

      var action = {};
      var els    = {};

      els.logo    = angular.element(document.getElementById('logo'));
      els.spinner = angular.element(document.getElementById('spinner'));

      action.showSpinner = function() {
        els.logo.addClass('hide');
        els.spinner.addClass('active');
      };

      action.hideSpinner = function() {
        els.logo.removeClass('hide');
        els.spinner.removeClass('active');
      };

      action.regionChange = function() {
        // Save region for future visits
        ConfigManager.set('region', $scope.region);

        action.showSpinner();
        // Fetch realms for given region
        ApiClient.findRealms($scope.region).then(function(realms) {

          action.hideSpinner();

          $scope.realms = realms.realms;

          $scope.doSearch = function() {
            action.showSpinner();
            // action.clearErrors();

            ApiClient.findCharacter(
              $scope.region,
              $scope.formData.realm,
              $scope.formData.name
            ).then(function(response) {
              action.hideSpinner();
              $scope.response = response;
            }, function(reason) {
              action.hideSpinner();
              console.error('Errors have occurred');
              console.error(reason);
              // TODO: Handle erroneous responses, i.e. if a character doesn't exist
              // action.addErrors();
            }, function(reason) {
              console.log('Something?');
            });
          };
        });
      };

      $scope.regions = [
        { 'name': 'Europe', 'value': 'eu' },
        { 'name': 'United States', 'value': 'us' },
        { 'name': 'Korea', 'value': 'kr' },
        { 'name': 'Taiwan', 'value': 'tw' }
      ];
      $scope.region  = ConfigManager.get('region');
      $scope.$watch('region', action.regionChange);
    }
  ])
  .controller('MyCtrl2', [function() {

  }]);
