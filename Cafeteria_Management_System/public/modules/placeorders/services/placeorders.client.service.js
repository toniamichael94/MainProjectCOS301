'use strict';

//Placeorders service used to communicate Placeorders REST endpoints
angular.module('placeorders').factory('Placeorders', ['$resource',
	function($resource) {
		return $resource('placeorders/:placeorderId', { placeorderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);