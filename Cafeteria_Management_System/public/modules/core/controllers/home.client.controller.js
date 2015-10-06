'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.myInterval = 50;
		 $scope.noWrapSlides = false;
		 var slides = $scope.slides = [];

		 //this is for the courosel on the
		 $scope.addSlide = function() {
			 var newWidth = 600 + slides.length + 1;

			 slides.push({
				 image: '//placekitten.com/' + newWidth + '/300',
				 text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
					 ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
			 });
		 };
		 for (var i=0; i<4; i++) {
			 $scope.addSlide();
		 }


	}
]);
