'use strict';

/* Controllers */

angular.module('wowpr.controllers', [])
  /**
   * Home screen controller
   * @route /
   */
  .controller('HomeCtrl', ['$scope', '$q', '$http', '$location', '$templateCache', 'ApiClient', 'ConfigManager',
    function($scope, $q, $http, $location, $templateCache, ApiClient, ConfigManager) {
      // Set up default config values here, other pages can redirect back to here
      // if they don't have sufficient data
      if ( ! ConfigManager.get('region')) {
        ConfigManager.set('region', 'eu');
      }

      var action = {};
      var els    = {};

      els.logo    = angular.element(document.getElementById('logo'));
      els.spinner = angular.element(document.getElementById('spinner'));

      action.hideSpinner = function() {
        els.logo.removeClass('hide');
        els.spinner.removeClass('active');
      };

      action.showSpinner = function() {
        els.logo.addClass('hide');
        els.spinner.addClass('active');
      };

      action.regionChange = function() {
        // Save region for future visits
        ConfigManager.set('region', $scope.region);

        // Fetch realms for given region
        action.showSpinner();
        ApiClient.findRealms($scope.region).then(function(realms) {
          action.hideSpinner();

          $scope.realms = realms.data.realms;

          var nameTimeout;
          var character;
          // TODO: Watch region and realm too...
          $scope.$watch('formData.name', function() {
            action.hideSpinner();
            clearTimeout(nameTimeout);
            nameTimeout = setTimeout(function() {
              action.showSpinner();
              ApiClient.findCharacter(
                $scope.region,
                $scope.formData.realm,
                $scope.formData.name
              ).then(function(response) {
                action.hideSpinner();

                response.data.profileMain = response.data.thumbnail.replace("avatar.jpg", "profilemain.jpg");
                $scope.character = response.data;
              }, function() {
                action.hideSpinner();
              });
            }, 1500);
          });

          $scope.doSearch = function() {

            // Clear any existing errors
            $scope.error = null;

            action.showSpinner();
            ApiClient.findCharacter(
              $scope.region,
              $scope.formData.realm,
              $scope.formData.name
            ).then(
              // Successfully found character
              function(response) {
                action.hideSpinner();
                $scope.response = response.data;

                $location.path('/character/' + $scope.formData.realm + '/' + $scope.formData.name);
              },

              // Error finding character
              function(response) {
                action.hideSpinner();

                $scope.error = response.data.reason;
              }
            );
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

      // Cache other templates
      $http.get('partials/character.html', { cache: $templateCache });
    }
  ])

  /**
   * Character screen controller
   * @route /character/:realm/:name
   */
  .controller('CharacterCtrl', ['$scope', '$http', '$location', '$routeParams', '$templateCache', 'ApiClient', 'ConfigManager',
    function($scope, $http, $location, $routeParams, $templateCache, ApiClient, ConfigManager) {
      // If config is not set up, send to homepage to get it set up properly
      if ( ! ConfigManager.get('region')) {
        $location.path('/');
      }

      // TODO: Start - Refactor this
      var action = {};
      var els    = {};


      els.logo    = angular.element(document.getElementById('logo'));
      els.spinner = angular.element(document.getElementById('spinner'));

      action.hideSpinner = function() {
        els.logo.removeClass('hide');
        els.spinner.removeClass('active');
      };

      action.showSpinner = function() {
        els.logo.addClass('hide');
        els.spinner.addClass('active');
      };
      // TODO: End - Refactor this

      action.region = ConfigManager.get('region');
      action.showSpinner();

      ApiClient.findCharacter(action.region, $routeParams.realm, $routeParams.name).then(
        function (response) {
          action.hideSpinner();
          console.log(response.data);
          $scope.character = response.data;
        },
        function (response) {
          action.hideSpinner();
          $scope.error = response.data.reason;
        }
      );

      // Cache other templates
      $http.get('partials/home.html', { cache: $templateCache });
    }
  ]);
