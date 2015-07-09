'use strict';

// MenuItems service used for communicating with the users REST endpoint
angular.module('menuItems').factory('MenuItems', ['$resource',
	function($resource) {
		return $resource('menuItems', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
