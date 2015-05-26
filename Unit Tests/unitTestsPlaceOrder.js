//Place order
var placeOrderObj = require('./placeOrder');
var profileObj=require('./profile');
var loginObj = require('./login');

it('should pass', function(done){
	var jsonObj = {
		employeeId="7657834657";
		password="dummy";
	}
	var result = loginObj .isLoggedIn(jsonObj) ;
		 if(result=="success- user is logged in"){
            throw 'true';
        }else 
		done();
 });

it('should fail', function(done){
	var jsonObj = {
		employeeId="";
		password="";
	}
	var result = loginObj .isLoggedIn(jsonObj) ;
		 if(result=="user not logged in"){
            throw 'false';
        }else 
		done();
 });
  
 it('should pass', function(done){
        var jsonObj = {
		productName="sandwich";
        }
        var result = checkProductAvailability()(jsonObj);
        if(result=="is available"){
            throw 'true';
        }else done();
        //done();
    });

 //non available salad
 it('should pass', function(done){
        var jsonObj = {
		productName="Greek salad";
        }
        var result = checkProductAvailabilit(jsonObj);
        if(result=="is not available"){
            throw 'true';
        }else done();
        //done();
    });

 it('should pass', function(done){
        var jsonObj = {
		employeeId="784365783467";
		totalPrice="R59.90";
        }
        var result = checkLimits(jsonObj);
        if(result=="success - within limit"){
            throw 'true';
        }else done();
        //done();
    });
 
 it('should fail', function(done){
        var jsonObj = {
		employeeId="784365783467";
		totalPrice="";
        }
        var result = checkLimits(jsonObj);
        if(result=="error - invalid parameters"){
            throw 'false';
        }else done();
        //done();
    });

 it('should fail', function(done){
        var jsonObj = {
		employeeId="";
		totalPrice="";
        }
        var result = checkLimits(jsonObj);
        if(result=="error - invalid parameters"){
            throw 'false';
        }else done();
        //done();
    });
 it('should fail', function(done){
        var jsonObj = {
		employeeId="";
		totalPrice="R10.00";
        }
        var result = checkLimits(jsonObj);
        if(result=="error - invalid parameters"){
            throw 'false';
        }else done();
        //done();
    });

 it('should pass', function(done){
        var jsonObj = {
		employeeId="3567832465476"; 
		items=[{"sandwich","R25.50"},{"fanta orange","R10.00"}];
        }
        var result = generateBill(jsonObj);
        if(result=="Successfully generated"){
            throw 'true';
        }else done(); 
    });

 it('should fail', function(done){
        var jsonObj = {
		employeeId=""; 
		items=[{"sandwich","R25.50"},{"fanta orange","R10.00"}];
        }
        var result = generateBill(jsonObj);
        if(result=="Unsuccessful"){
            throw 'false';
        }else done(); 
    });

 it('should fail', function(done){
        var jsonObj = {
		employeeId="474562786579"; 
		items=[];
        }
        var result = generateBill(jsonObj);
        if(result=="Unsuccessful"){
            throw 'false';
        }else done(); 
    });

