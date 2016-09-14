"use strict";angular.module("g1b.datetime-range",[]).directive("datetimeRange",["$document","$timeout",function(e,t){return{restrict:"E",scope:{start:"=",end:"=",onChange:"&?",onChangeStart:"&?",onChangeEnd:"&?",onClose:"&?"},replace:!0,template:"<div class=datetime-range><div class=start-datetime ng-click=selectDate(start) ng-class=\"{'active': selected === start, 'warning': warning === 'start' }\"><div class=date>{{ start.format('DD MMMM YYYY') }}</div><div class=time>{{ start.format('HH : mm : ss') }}</div></div><div class=end-datetime ng-click=selectDate(end) ng-class=\"{'active': selected === end, 'warning': warning === 'end'}\"><div class=date>{{ end.format('DD MMMM YYYY') }}</div><div class=time>{{ end.format('HH : mm : ss') }}</div></div><div class=edit-popover ng-show=!!selected><div class=calendar-toggle ng-class=\"{'start': selected === start, 'end': selected === end}\" ng-click=\"calendar_active = !calendar_active\">{{ selected.format('DD MMMM YYYY') }}</div><div class=calendar ng-show=!!calendar_active><div class=calendar-header><div class=\"arrow arrow-left\" ng-click=\"calendar.subtract(1, 'months')\"></div>{{ calendar.format('MMMM') }}<div class=\"arrow arrow-right\" ng-click=\"calendar.add(1, 'months')\"></div></div><div class=calendar-body><div class=weekdays><span class=weekday ng-repeat=\"weekday in 'weeeeek' track by $index\">{{ calendar.clone().startOf('week').add($index, 'days').format('ddd') }}</span></div><div class=week ng-repeat=\"week in 'months' | limitTo: ((calendar.clone().endOf('month').week() - calendar.clone().startOf('month').week()) + 1) track by $index\"><span class=date ng-repeat=\"date in 'weeeeek' track by $index\" ng-class=\"{ 'current': calendar.clone().startOf('month').add($parent.$index, 'weeks').weekday($index).startOf('day').isSame(current.clone().startOf('day')), 'active': calendar.clone().startOf('month').add($parent.$index, 'weeks').weekday($index).startOf('day').isSame(selected.clone().startOf('day')), 'inactive': calendar.clone().startOf('month').add($parent.$index, 'weeks').weekday($index).month() !== calendar.month() }\" ng-click=\"setDate(selected.clone().year(calendar.clone().startOf('month').add($parent.$index, 'weeks').weekday($index).year()).month(calendar.clone().startOf('month').add($parent.$index, 'weeks').weekday($index).month()).date(calendar.clone().startOf('month').add($parent.$index, 'weeks').weekday($index).date()), true)\">{{ calendar.clone().startOf('month').add($parent.$index, 'weeks').weekday($index).date() }}</span></div></div></div><div class=timer><div class=timer-hours scroll-up=\"setDate(selected.clone().add(1, 'hours'))\" scroll-down=\"setDate(selected.clone().subtract(1, 'hours'))\"><div class=\"arrow arrow-up\" ng-click=\"setDate(selected.clone().add(1, 'hours'))\"></div>{{ selected.format('HH') }}<div class=\"arrow arrow-down\" ng-click=\"setDate(selected.clone().subtract(1, 'hours'))\"></div></div><div class=timer-divider>:</div><div class=timer-minutes scroll-up=\"setDate(selected.clone().add(1, 'minutes'))\" scroll-down=\"setDate(selected.clone().subtract(1, 'minutes'))\"><div class=\"arrow arrow-up\" ng-click=\"setDate(selected.clone().add(1, 'minutes'))\"></div>{{ selected.format('mm') }}<div class=\"arrow arrow-down\" ng-click=\"setDate(selected.clone().subtract(1, 'minutes'))\"></div></div><div class=timer-divider>:</div><div class=timer-seconds scroll-up=\"setDate(selected.clone().add(1, 'seconds'))\" scroll-down=\"setDate(selected.clone().subtract(1, 'seconds'))\"><div class=\"arrow arrow-up\" ng-click=\"setDate(selected.clone().add(1, 'seconds'))\"></div>{{ selected.format('ss') }}<div class=\"arrow arrow-down\" ng-click=\"setDate(selected.clone().subtract(1, 'seconds'))\"></div></div></div><div class=close-button ng-if=!!onClose><div ng-click=close()>Close</div></div></div></div>",compile:function(){return{pre:function(){},post:function(a,n){a.current=moment(),a.selectDate=function(e){a.selected===e?a.selected=void 0:(a.selected=e,a.calendar=a.selected.clone())},a.setDate=function(e,n){a.selected.isSame(e)||(a.selected===a.start&&e<a.end||a.selected===a.end&&e>a.start?(a.selected.year(e.year()).month(e.month()).date(e.date()).hours(e.hours()).minutes(e.minutes()).seconds(e.seconds()),(a.selected.clone().startOf("week").month()!==a.calendar.month()&&a.selected.clone().endOf("week").month()!==a.calendar.month()||n)&&(a.calendar=a.selected.clone()),a.callback()):(a.warning=a.selected===a.start?"end":"start",t(function(){a.warning=void 0},250)))},a.callback=function(){a.onChangeStart&&a.selected===a.start&&a.onChangeStart(),a.onChangeEnd&&a.selected===a.end&&a.onChangeEnd(),a.onChange&&a.onChange()},a.start&&!a.start._isAMomentObject&&(a.start=moment(a.start)),a.end&&!a.end._isAMomentObject&&(a.end=moment(a.end)),a.close=function(){a.selected="",a.calendar_active=!1,a.onClose()},e.on("mousedown",function(e){a.selected&&!n[0].contains(e.target)&&a.$apply(function(){a.selected="",a.calendar_active=!1})})}}}}}]),angular.module("g1b.datetime-range").directive("scrollUp",function(){return{restrict:"A",compile:function(){return{pre:function(){},post:function(e,t,a){t.bind("DOMMouseScroll mousewheel wheel",function(t){t=t.originalEvent||t;var n=t.wheelDelta||-1*t.deltaY||0;n>0&&(e.$apply(function(){e.$eval(a.scrollUp)}),t.preventDefault())})}}}}}),angular.module("g1b.datetime-range").directive("scrollDown",function(){return{restrict:"A",compile:function(){return{pre:function(){},post:function(e,t,a){t.bind("DOMMouseScroll mousewheel wheel",function(t){t=t.originalEvent||t;var n=t.wheelDelta||-1*t.deltaY||0;0>n&&(e.$apply(function(){e.$eval(a.scrollDown)}),t.preventDefault())})}}}}});