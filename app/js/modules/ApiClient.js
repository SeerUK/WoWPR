var ApiClient = function($http, $q) {
  /**
   * Perform a request
   *
   * @return object
   */
  var request = function(region, uri) {
    var deferred = $q.defer();

    $http.get('proxy.php?region=' + region + '&uri=' + uri)
      .success(function(data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function(data, status, headers, config) {
        return false;
      });

    return deferred.promise;
  };


  return {
    findCharacter: function(region, realm, name) {
      return request(
        region,
        '/api/wow/character/' + realm + '/' + name
      );
    }
  }
};
