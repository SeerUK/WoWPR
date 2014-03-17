var ApiClient = function(injected) {
  var constructed = injected;

  return {
    name: 'ApiClient',
    getConstructed: function() {
      return constructed;
    }
  }
};
