'use strict';

angular.module('g1b.datetime-range', []).
  directive('datetimeRange', ['$document', '$timeout', function ($document, $timeout) {

  return {
    restrict: 'E',
    scope: {
      start: '=',
      end: '=',
      presets: '=?',
      onChange: '&?',
      onChangeStart: '&?',
      onChangeEnd: '&?',
      onClose: '&?',
    },
    replace: true,
    templateUrl: './datetime-range.html',
    compile: function () {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element) {

          // Get current date
          scope.current = moment();

          // Set selected date
          scope.selectDate = function (date) {
            if ( scope.selected === date ) {
              scope.selected = undefined;
            } else {
              scope.selected = date;
              scope.calendar = scope.selected.clone();
              scope.presetsActive = false;
            }
          };

          // Update selected date
          scope.setDate = function (date, calendar_update) {
            if ( scope.selected.isSame(date) ) { return; }
            if ( ( scope.selected === scope.start && date < scope.end ) || ( scope.selected === scope.end && date > scope.start ) ) {
              scope.selected.year(date.year()).month(date.month()).date(date.date()).hours(date.hours()).minutes(date.minutes()).seconds(date.seconds());
              if ( (scope.selected.clone().startOf('week').month() !== scope.calendar.month() && scope.selected.clone().endOf('week').month() !== scope.calendar.month()) || calendar_update ) {
                scope.calendar = scope.selected.clone();
              }
              scope.callback();
            } else {
              scope.warning = ( scope.selected === scope.start ) ? 'end' : 'start';
              $timeout(function () {
                scope.warning = undefined;
              }, 250);
            }
          };

          // Set start and end datetime objects to the selected preset
          scope.selectPreset = function (preset) {
            if ( !!scope.selected && scope.selected === scope.start ) {
              scope.selected = preset.start;
            } else if ( !!scope.selected && scope.selected === scope.end ) {
              scope.selected = preset.end;
            }
            scope.start = preset.start;
            scope.end = preset.end;
            scope.presetsActive = false;
            scope.callback(true);
          };

          // Callbacks fired on change of start and/or end datetime objects
          scope.callback = function (allChanged) {
            if ( !!scope.onChangeStart && (allChanged || scope.selected === scope.start) ) {
              scope.onChangeStart();
            }
            if ( !!scope.onChangeEnd && (allChanged || scope.selected === scope.end) ) {
              scope.onChangeEnd();
            }
            if ( !!scope.onChange ) {
              scope.onChange();
            }
          };

          // Convert start datetime to moment.js if its not a moment object yet
          if ( scope.start && !scope.start._isAMomentObject ) {
            scope.start = moment(scope.start);
          }

          // Convert end datetime to moment.js if its not a moment object yet
          if ( scope.end && !scope.end._isAMomentObject ) {
            scope.end = moment(scope.end);
          }

          // Close edit popover
          scope.close = function () {
            scope.selected = '';
            scope.presetsActive = false;
            scope.calendarActive = false;

            if ( !!scope.onClose ) {
              scope.onClose();
            }
          }

          // Bind click events outside directive to close edit popover
          $document.on('mousedown', function (e) {
            if ( !element[0].contains(e.target) && (!!scope.presetsActive || !!scope.selected) ) {
              scope.$apply(function () {
                scope.close();
              });
            }
          });

          // Bind 'esc' keyup event to close edit popover
          $document.on('keyup', function (e) {
            if ( e.keyCode === 27 && (!!scope.presetsActive || !!scope.selected) ) {
              scope.$apply(function () {
                scope.close();
              });
            }
          });
        }
      };
    }
  };
}]);

// Scroll up directive
angular.module('g1b.datetime-range').
  directive('scrollUp', function () {
  return {
    restrict: 'A',
    compile: function () {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element, attrs) {
          element.bind('DOMMouseScroll mousewheel wheel', function (ev) {
            ev = ev.originalEvent || ev;
            var delta = ev.wheelDelta || (-1 * ev.deltaY) || 0;
            if ( delta > 0 ) {
              scope.$apply(function () {
                scope.$eval(attrs.scrollUp);
              });
              ev.preventDefault();
            }
          });
        }
      };
    }
  };
});

// Scroll down directive
angular.module('g1b.datetime-range').
  directive('scrollDown', function () {
  return {
    restrict: 'A',
    compile: function () {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element, attrs) {
          element.bind('DOMMouseScroll mousewheel wheel', function (ev) {
            ev = ev.originalEvent || ev;
            var delta = ev.wheelDelta || (-1 * ev.deltaY) || 0;
            if ( delta < 0 ) {
              scope.$apply(function () {
                scope.$eval(attrs.scrollDown);
              });
              ev.preventDefault();
            }
          });
        }
      };
    }
  };
});
