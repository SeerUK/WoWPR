var ConfigManager = function(StorageEngine) {
  /**
   * @type Object
   */
  var keys = StorageEngine.get('wowpr.config') || {};

  return {
    /**
     * Get a config value by its key
     *
     * @param  string key
     * @return string
     */
    get: function(key) {
      return keys[key] || false;
    },

    /**
     * Set a config value by its key
     *
     * @param  string key
     * @param  string value
     * @return ConfigManager
     */
    set: function(key, value) {
      keys[key] = value;

      StorageEngine.set('wowpr.config', keys);

      return this;
    }
  }
};
