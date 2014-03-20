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
        deferred.resolve({
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      })
      .error(function(data, status, headers, config) {
        deferred.reject({
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });

    return deferred.promise;
  };


  return {
    /**
     * Find a character
     *
     * @param  string region
     * @param  string realm
     * @param  string name
     * @return deferred
     */
    findCharacter: function(region, realm, name) {
      return request(
        region,
        '/api/wow/character/' + realm + '/' + name
      );
    },

    /**
     * Find all realms
     *
     * @param  string region
     * @return deferred
     */
    findRealms: function(region) {
      return request(
        region,
        '/api/wow/realm/status'
      );
    }
  }
};
