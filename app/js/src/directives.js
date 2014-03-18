'use strict';

/* Directives */

angular.module('wowpr.directives', [])
  .directive('asideMenuButton', [function() {
    return {
      restrict: 'A',
      link: function(scope, $el, attrs) {
        var $aside = angular.element(document.getElementById(attrs.parent));
        var $body  = angular.element(document.getElementsByTagName('body'));

        var _hide = function() {
          $aside.removeClass('active');
          $body.removeClass('aside-active');

          if ($aside.hasClass('left')) {
            $body.removeClass('active');
            $body.removeClass('left');
          }

          if ($aside.hasClass('right')) {
            $body.removeClass('active');
            $body.removeClass('right');
          }
        };

        var _show = function() {
          $aside.addClass('active');
          $body.addClass('aside-active');

          if ($aside.hasClass('left')) {
            $body.addClass('left');
            $body.addClass('active');
          }

          if ($aside.hasClass('right')) {
            $body.addClass('right');
            $body.addClass('active');
          }
        };

        $body.on('click', function(e) {
          if ($aside.hasClass('active')) {
            _hide();
          }
        });

        $aside.on('click', function(e) {
          e.stopPropagation();
        });

        $el.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          if ($aside.hasClass('active')) {
            _hide();
          } else {
            _show();
          }
        });
      }
    };
  }]);
