'use strict';


angular.module('core').controller('HomeController', ['$scope', '$animate', '$http','Authentication',
	function($scope, $animate, $http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		//Disable animate for carousel
		$animate.enabled(false);
		
		$scope.myInterval = 2000;
		 $scope.noWrapSlides = false;
		 var slides = $scope.slides = [];

		 /*this is for the courosel on the
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
		*/
		var captions = [];
		$scope.getCaptions = function(){
			$http.get('/loadCaptions').success(function(response){
				captions = response.message;
				for(var i=1; i <=4;i++){
					slides.push({
						image: 'modules/core/img/brand/carousel-'+i+'.png',
						text: captions[i-1].value
					});
				}
			}).error(function(response){
				captions[0] = captions[1] = captions[2] = captions[3] = "";
			});
		};
		
		
	}
]);
