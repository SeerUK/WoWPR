'use strict';

/* Controllers */

angular.module('wowpr.controllers', [])
  /**
   * Home screen controller
   * @route /
   */
  .controller('HomeCtrl', ['$scope', '$q', '$http', '$location', '$templateCache', 'ApiClient', 'CharacterDataHelper', 'ConfigManager', 'SpinnerHelper',
    function($scope, $q, $http, $location, $templateCache, ApiClient, CharacterDataHelper, ConfigManager, SpinnerHelper) {
      // Set up default config values here, other pages can redirect back to here
      // if they don't have sufficient data
      if ( ! ConfigManager.get('region')) {
        ConfigManager.set('region', 'eu');
      }

      var action = {};

      action.regionChange = function() {
        // Save region for future visits
        ConfigManager.set('region', $scope.region);

        // Fetch realms for given region
        SpinnerHelper.showSpinner();
        ApiClient.findRealms($scope.region).then(function(realms) {
          SpinnerHelper.hideSpinner();

          $scope.realms = realms.data.realms;

          $scope.doSearch = function() {
            // Clear any existing errors
            $scope.error = null;

            SpinnerHelper.showSpinner();
            ApiClient.findCharacter(
              $scope.region,
              $scope.formData.realm,
              $scope.formData.name
            ).then(
              // Successfully found character
              function(response) {
                SpinnerHelper.hideSpinner();

                if (JSON.stringify(response.data) !== '{}') {
                  $scope.response = response.data;
                  $location.path('/character/' + $scope.formData.realm + '/' + $scope.formData.name);
                } else {
                  $scope.error = "The armory has not updated this character.";
                }
              },

              // Error finding character
              function(response) {
                SpinnerHelper.hideSpinner();

                $scope.error = response.data.reason;
              }
            );
          };
        });
      };

      action.updateCharacterPreview = function() {
        if ( ! $scope.region || ! $scope.formData.realm || ! $scope.formData.name) {
          return false;
        }

        // Clear any existing errors
        $scope.error = null;

        SpinnerHelper.showSpinner();

        ApiClient.findCharacter(
          $scope.region,
          $scope.formData.realm,
          $scope.formData.name
        ).then(function(response) {
          SpinnerHelper.hideSpinner();

          if (response.data.thumbnail) {
            response.data.profileMain = response.data.thumbnail.replace("avatar.jpg", "profilemain.jpg");
          }

          response.data.factionName = CharacterDataHelper.getFactionByRaceId(response.data.race);
          $scope.character = response.data;
        }, function() {
          SpinnerHelper.hideSpinner();
          delete $scope.character;
        });
      };

      var nameTimeout;
      $scope.$watch('region', action.updateCharacterPreview);
      $scope.$watch('formData.realm', action.updateCharacterPreview);
      $scope.$watch('formData.name', function() {
        SpinnerHelper.hideSpinner();
        clearTimeout(nameTimeout);
        nameTimeout = setTimeout(function() {
          action.updateCharacterPreview();
        }, 400);
      });

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
  .controller('CharacterCtrl', ['$scope', '$http', '$location', '$routeParams', '$templateCache', 'ApiClient', 'CharacterDataHelper', 'ConfigManager', 'ScoreCalculator', 'SpinnerHelper',
    function($scope, $http, $location, $routeParams, $templateCache, ApiClient, CharacterDataHelper, ConfigManager, ScoreCalculator, SpinnerHelper) {
      // If config is not set up, send to homepage to get it set up properly
      if ( ! ConfigManager.get('region')) {
        $location.path('/');
      }

      var action = {};

      action.region = ConfigManager.get('region');
      SpinnerHelper.showSpinner();

      ApiClient.findFullCharacter(action.region, $routeParams.realm, $routeParams.name).then(
        function (response) {
          SpinnerHelper.hideSpinner();

          // Augment character data
          if (response.data.thumbnail) {
            response.data.profileMain = response.data.thumbnail.replace("avatar.jpg", "profilemain.jpg");
          }

          response.data.className   = CharacterDataHelper.getClassNameById(response.data.class);
          response.data.classSlug   = CharacterDataHelper.getClassSlugById(response.data.class);
          response.data.factionName = CharacterDataHelper.getFactionByRaceId(response.data.race);
          response.data.region      = action.region;
          response.data.realmSlug   = $routeParams.realm;
          response.data.title       = CharacterDataHelper.getActiveTitleFromTitles(response.data.titles);

          // console.log(response.data);
          // console.log(ScoreCalculator.getScore($scope.character));

          $scope.character = response.data;
          $scope.scores    = ScoreCalculator.getScore($scope.character);
        },
        function (response) {
          SpinnerHelper.hideSpinner();
          $scope.error = response.data.reason;
        }
      );

      // Cache other templates
      $http.get('partials/home.html', { cache: $templateCache });
    }
  ]);
