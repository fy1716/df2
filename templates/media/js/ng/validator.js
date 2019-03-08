angular.module('app.controllers')
	.directive('intPostValidator', ['$log', function ($log) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				ctrl.IllegalCharacter = function(modelValue) {
					return /^(0|[1-9]\d*)$/.test(modelValue);
				};
			}
		};
	}]);

