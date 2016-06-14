'use strict';

angular.module('g1b.datetime-range', []).
  directive('datetimeRange', ['$document', function ($document) {

  return {
    restrict: 'E',
    scope: {
      start: '=',
      end: '=',
      handler: '&'
    },
    replace: true,
    template:'<div class=datetime-range><div class=start-datetime ng-click="selected = ( selected === start ) ? \'\' : start" ng-class="{\'active\': selected === start}"><div class=date>{{ start.format(\'DD MMMM YYYY\') }}</div><div class=time>{{ start.format(\'HH : mm : ss\') }}</div></div><div class=end-datetime ng-click="selected = ( selected === end ) ? \'\' : end" ng-class="{\'active\': selected === end}"><div class=date>{{ end.format(\'DD MMMM YYYY\') }}</div><div class=time>{{ end.format(\'HH : mm : ss\') }}</div></div><div class=edit-popover ng-show=!!selected><div class=calendar-toggle ng-class="{\'start\': selected === start, \'end\': selected === end}" ng-click="calendar_active = !calendar_active">{{ selected.format(\'DD MMMM YYYY\') }}</div><div class=calendar ng-show=!!calendar_active><div class=calendar-header><div class="arrow arrow-left" ng-click="selected.subtract(1, \'months\') && handler(start, end)"></div>{{ selected.format(\'MMMM\') }}<div class="arrow arrow-right" ng-click="selected.add(1, \'months\') && handler(start, end)"></div></div><div class=calendar-body><div class=weekdays><span class=weekday ng-repeat="weekday in \'weeeeek\' track by $index">{{ selected.clone().startOf(\'week\').add($index, \'days\').format(\'ddd\') }}</span></div><div class=week ng-repeat="week in \'months\' | limitTo: (selected.clone().endOf(\'month\').week() - selected.clone().startOf(\'month\').week()) + 1 track by $index"><span class=date ng-repeat="date in \'weeeeek\' track by $index" ng-class="{ \'active\': selected.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).startOf(\'day\').isSame(selected.clone().startOf(\'day\')), \'inactive\': selected.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).month() !== selected.month() }" ng-click="selected.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).month() === selected.month() && selected.date(selected.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).date()) && handler(start, end)">{{ selected.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).date() }}</span></div></div></div><div class=timer><div class=timer-hours><div class="arrow arrow-up" ng-click="selected.add(1, \'hours\') && handler(start, end)"></div>{{ selected.format(\'HH\') }}<div class="arrow arrow-down" ng-click="selected.subtract(1, \'hours\') && handler(start, end)"></div></div><div class=timer-divider>:</div><div class=timer-minutes><div class="arrow arrow-up" ng-click="selected.add(1, \'minutes\') && handler(start, end)"></div>{{ selected.format(\'mm\') }}<div class="arrow arrow-down" ng-click="selected.subtract(1, \'minutes\') && handler(start, end)"></div></div><div class=timer-divider>:</div><div class=timer-seconds><div class="arrow arrow-up" ng-click="selected.add(1, \'seconds\') && handler(start, end)"></div>{{ selected.format(\'ss\') }}<div class="arrow arrow-down" ng-click="selected.subtract(1, \'seconds\') && handler(start, end)"></div></div></div></div></div>',
    compile: function () {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element) {

          // Convert start datetime to moment.js if its not a moment object yet
          if ( !scope.start._isAMomentObject ) {
            scope.start = moment(scope.start);
          }

          // Convert end datetime to moment.js if its not a moment object yet
          if ( !scope.end._isAMomentObject ) {
            scope.end = moment(scope.end);
          }

          // Bind click events outside directive to close edit popover
          $document.on('click', function (e) {
            if ( !!scope.selected && !element[0].contains(e.target) ) {
              scope.$apply(function () {
                scope.selected = '';
                scope.calendar_active = false;
              });
            }
          });
        }
      };
    }
  };
}]);