(function () {
		'use strict';


var dataURL = "trees-in-cuenca-ecuador/app/resources/data/trees.json";

angular.module('incuencaecuador.trees', [])
	.component('treeList', {
		bindings: {},
		templateUrl: 'trees-in-cuenca-ecuador/app/components/views/treeList.html',
		controller: function ($scope, $http, $filter) {
			var $ctrl = this;
			$ctrl.$onInit = function () {
				$http.get(dataURL)
					.then(function successCallback(response) {
						$scope.trees = response.data.filter(function(t) {
							return t.nombre;
						});
						$scope.filteredTrees = $scope.trees.map(function(t){
							t['filter-terms'] = [ 
								t.nombre,
								t.habito,
								t.descripcíon,
								t.otros_nombres_comunes.join(' '),
								t.nombre_cientifica
							].join(' ');
							return t;
						})
					}, function errorCallback(response) {
						console.log("there was an error");
					});
			}
			$scope.filter = function(word) {
				$scope.filteredTrees = $filter('match-word-plural')($scope.trees,  word);
			}
		}
	})
	.component('treeDetail', {
		bindings: {},
		templateUrl: 'trees-in-cuenca-ecuador/app/components/views/treeView.html',
		controller: function ($stateParams, $scope, $http) {
			var $ctrl = this;
			var disallowedKeys = [
				'images',
				'slug',
				'otros_nombres_comunes',
				'nombre_cientifica'

			]
			$ctrl.$onInit = function () {
				$http.get(dataURL)
					.then(function successCallback(response) {
						$scope.tree = response.data.find(function (tree) {
							return tree.slug === $stateParams.treeName;
						})

						$scope.tree.keys = Object.keys($scope.tree).filter(function(k) {
							return disallowedKeys.indexOf(k) === -1;
						});
						delete $scope.tree.original;
					}, function errorCallback(response) {
						console.log("there was an error");
					});
			}
		}
	});

}());