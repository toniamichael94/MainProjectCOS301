
//manageProfile

 it('should pass', function(done){
        var jsonObj = {
		employeeId="78346857634785"; 
		password="dummy";
		newPassword="dummer";
		
        }
        var result = changePassword(jsonObj);
        if(result=="successfully changed"){
            throw 'true';
        }else done(); 
    });

 it('should fail', function(done){
        var jsonObj = {
		employeeId="78346857634785"; 
		password="dummy";
		newPassword="";
		
        }
        var result = changePassword(jsonObj);
        if(result=="invalid parameters"){
            throw 'false';
        }else done(); 
    });

 it('should pass', function(done){
        var jsonObj = {
		employeeId="78346857634785"; 
		password="dummy";
		newPassword="dummer";
		
        }
        var result = changePassword(jsonObj);
        if(result=="successfully changed"){
            throw 'true';
        }else done(); 
    });

 it('should pass', function(done){
        var jsonObj = {
		employeeId="78346857634785"; 
		email="dummy@gmail.com"; 
		
        }
        var result = changeEmail(jsonObj);
        if(result=="successfully changed"){
            throw 'true';
        }else done(); 
    });

 it('should fail', function(done){
        var jsonObj = {
		employeeId="78346857634785"; 
		email="tonia";
        }
        var result = changeEmail(jsonObj);
        if(result=="invalid params"){
            throw 'false';
        }else done(); 
    });

it('should pass', function(done){
        var jsonObj = {
		employeeId="78346857634785";  
		newLimit="R1000"; 
        }
        var result = setLimit(jsonObj);
        if(result=="successful - limit is within the system limit"){
            throw 'true';
        }else done(); 
    });
it('should fail', function(done){
        var jsonObj = {
		employeeId="78346857634785";  
		newLimit="R5000000"; 
		
        }
        var result = setLimit(jsonObj);
        if(result=="unsuccessful - limit is not within the system limit"){
            throw 'false';
        }else done(); 
    });

it('should fail', function(done){
        var jsonObj = {
		employeeId="78346857634785";  
		newLimit=""; 
		
        }
        var result = setLimit(jsonObj);
        if(result=="unsuccessful - invalid params){
            throw 'false';
        }else done(); 
    });

it('should pass', function(done){
        var jsonObj = {
		employeeId="78346857634785";  
		newRecipient = "payroll"; 
		
        }
        var result = editRecipients(jsonObj);
        if(result=="recipients changed"){
            throw 'true';
        }else done(); 
    });


it('should pass', function(done){
        var jsonObj = {
		employeeId="78346857634785";    
        }
        var result = displayBill(jsonObj);
        if(result=="success"){
            throw 'true';
        }else done(); 
    });


it('should fail', function(done){
        var jsonObj = {
		employeeId="";
        }
        var result = editRecipients(jsonObj);
        if(result=="invalid params"){
            throw 'false';
        }else done(); 
    });

it('should pass', function(done){
        var jsonObj = {
		employeeId="78346857634785";    
        }
        var result = viewHistory(jsonObj);
        if(result=="success"){
            throw 'true';
        }else done(); 
    });

it('should fail', function(done){
        var jsonObj = {
		employeeId="";    
        }
        var result = viewHistory(jsonObj);
        if(result=="invalid params"){
            throw 'false';
        }else done(); 
    });

it('should pass', function(done){
        var jsonObj = {
		employeeId="78346857634785";    
        }
        var result = generateFavourites(jsonObj);
        if(result=="success"){
            throw 'true';
        }else done(); 
    });

it('should fail', function(done){
        var jsonObj = {
		employeeId="";    
        }
        var result = generateFavourites(jsonObj);
        if(result=="invalid params"){
            throw 'false';
        }else done(); 
    });
