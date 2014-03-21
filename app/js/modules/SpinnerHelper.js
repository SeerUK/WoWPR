var SpinnerHelper = function() {
  /**
   * @type Object
   */
  var els    = {};

  els.logo    = angular.element(document.getElementById('logo'));
  els.spinner = angular.element(document.getElementById('spinner'));

  return {
    /**
     * Hides the Spinner
     */
    hideSpinner: function() {
      els.logo.removeClass('hide');
      els.spinner.removeClass('active');
    },

    /**
     * Shows the spinner
     */
    showSpinner: function() {
      els.logo.addClass('hide');
      els.spinner.addClass('active');
    }
  }
};
