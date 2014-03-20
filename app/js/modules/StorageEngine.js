var StorageEngine = function() {
  /**
   * Check if local storage is supported
   *
   * @return Boolean
   */
  var isLocalStorageAllowed = function() {
    return typeof(Storage) === "undefined"
      ? false
      : true;
  };

  return {
    /**
     * Get a storage value by its key
     *
     * @param  string key
     * @return string
     */
    get: function(key) {
      return isLocalStorageAllowed
        ? JSON.parse(localStorage.getItem(key))
        : false; // Cookie NYI
    },

    /**
     * Set a storage value by its key
     *
     * @param  string key
     * @param  string value
     * @return ConfigManager
     */
    set: function(key, value) {
      isLocalStorageAllowed
        ? localStorage.setItem(key, JSON.stringify(value))
        : false; // Cookie NYI

        return this;
    },

    /**
     * Unset a storage value by its key
     *
     * @param  string key
     * @return ConfigManager
     */
    unset: function(key) {
      isLocalStorageAllowed
        ? localStorage.removeItem(key)
        : false; // Cookie NYI

      return this;
    }
  }
};
