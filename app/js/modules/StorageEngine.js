var StorageEngine = function($cookieStore) {
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
        : $cookieStore.get(key);
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
        : $cookieStore.put(key, value);

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
        : $cookieStore.remove(key);

      return this;
    }
  }
};
