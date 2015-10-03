angular.module('blablacar.directives', [])

// Transform value of datepicker in timestamp
.directive('stringToTimestamp', function() {
        return {
            require: 'ngModel',
            link: function(scope, ele, attr, ngModel) {
                ngModel.$parsers.push(function(value) {
                    return Date.parse(value)/1000;
                });
            }
        }
    });