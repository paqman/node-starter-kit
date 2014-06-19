/**
 * Starter Controller.
 * Required for Angularjs
 * @param {type} $scope
 * @returns {undefined}
 */

function StartCtrl($scope) {
	$scope.show = true;
	$scope.hello = "Angular is running.";

	$scope.click = function(){
		$scope.show = !$scope.show;
	}
}