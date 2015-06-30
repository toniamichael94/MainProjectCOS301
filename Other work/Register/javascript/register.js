


(function(){
var register = angular.module('register',[]);

register.controller('SubmitController',function(){
	
	this.details = registerDetails;
	
	this.sumbitDetails = function(){
		alert('in submit details');
	};
	
});

var registerDetails = {
	id:"",
	name:"",
	lastName:"",
	email:"",
	limit:null,
	password:""
};


})();