'use strict';

/* Controllers */

angular.module('wowpr.controllers', [])
  .controller('HomeCtrl', ['$scope', '$q', 'ApiClient', 'ConfigManager',
    function($scope, $q, ApiClient, ConfigManager) {
      // Set up default config values here, other pages can redirect back to here
      // if they don't have sufficient data
      var action = {};

      if ( ! ConfigManager.get('region')) {
        ConfigManager.set('region', 'eu');
      }

      // Set up spinner
      _logo    = angular.element(document.getElementById('logo'));
      _spinner = angular.element(document.getElementById('spinner'));

      action.showSpinner = function() {
        _logo.addClass('hide');
        _spinner.addClass('active');
      };

      action.hideSpinner = function() {
          _logo.removeClass('hide');
          _spinner.removeClass('active');
      };

      $scope.regions = [
        { 'name': 'Europe', 'value': 'eu' },
        { 'name': 'United States', 'value': 'us' },
        { 'name': 'Korea', 'value': 'kr' },
        { 'name': 'Taiwan', 'value': 'tw' }
      ];
      $scope.region  = ConfigManager.get('region');
      $scope.$watch('region', function() {
        ConfigManager.set('region', $scope.region);

        action.showSpinner();

        ApiClient.findRealms($scope.region).then(function(realms) {

          action.hideSpinner();
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
