(function () {
	'use strict';
	// Defining Angular app model with all other dependent modules
	var app = angular.module('incuencaecuador', ['ui.router', 'ngParseExt',
			'incuencaecuador.trees', 
		])
		.config(routeConfig)
		.filter('match-word-plural', function() {
			return function(items, word) {
			  var rgx = new RegExp('\\b' + word.toLowerCase());
			  return items.filter(function(item) {
				if (!item['filter-terms']) { return false; }
				var filterTerms = item['filter-terms'].toLowerCase();
				return rgx.test(filterTerms)
			  })
			}
		})
		.filter('readable', function() {
			return function(word) {
			  var rgx = new RegExp('\\b' + word.toLowerCase());
			  word = word.split('_').join(' ');
			  word = word.charAt(0).toUpperCase() + word.slice(1)
			  return word;
			}
		})

	routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

	function routeConfig($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.rule(function ($injector, $location) {
			var path = $location.path();
			var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

			if (hasTrailingSlash) {
				// if last character is a slash, return the same url without the slash
				var newPath = path.substr(0, path.length - 1);
				$location.replace().path(newPath);
			}
		});

		// Redirect to 404 when route not found
		$urlRouterProvider.otherwise(function ($injector, $location) {
			$injector.get('$state').transitionTo('trees', null, {
				location: false
			});
		});

		$stateProvider
			.state('treedetail', {
				url: '/trees/:treeName',
				component: 'treeDetail'
			})
			.state('trees', {
				url: '/trees',
				component: 'treeList'
			})
	}
}());