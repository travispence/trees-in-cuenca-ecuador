(function () {
		'use strict';


var dataURL = "/resources/data/trees.json";

angular.module('incuencaecuador.trees', [])
	.component('treeList', {
		bindings: {},
		templateUrl: 'trees-in-cuenca-ecuador/app/components/views/treeList.html',
		controller: function ($scope, $http) {
			var $ctrl = this;
			$ctrl.$onInit = function () {
				$http.get(dataURL)
					.then(function successCallback(response) {
						$scope.trees = response.data;
					}, function errorCallback(response) {
						console.log("there was an error");
					});
			}
		}
	})
	.component('treeDetail', {
		bindings: {},
		templateUrl: 'trees-in-cuenca-ecuador/app/components/views/treeView.html',
		controller: function ($stateParams, $scope, $http) {
			var $ctrl = this;
			$ctrl.$onInit = function () {
				$http.get(dataURL)
					.then(function successCallback(response) {
						$scope.tree = response.data.find(function (tree) {
							return tree.slug === $stateParams.treeName;
						})
					}, function errorCallback(response) {
						console.log("there was an error");
					});
			}
		}
	});

}());