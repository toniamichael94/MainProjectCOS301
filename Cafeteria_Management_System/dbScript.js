var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var conn = mongoose.createConnection("mongodb://localhost/CMS_DB");
/*
conn.connection.on('error', function(err){
    console.log("Error: Cannot connect - " + err);
});
*/
var testSchema = conn.model("users", new Schema({
    EmployeeID: String,
    Name: String,
    Surname: String,
    Balance: Number,
    Role: String,
    password: String
}, {versionKey: false}), "users");

new testSchema({
    EmployeeID: '0000',
    Name: 'Superuser',
    Surname: 'Superuser',
    Balance: 0,
    Role: 'superuser',
    password: '1234'
}).save(function(err){
        if(err != null)
            console.log(err);
        else
            console.log("Record succefully added!");
    });

new testSchema({
    EmployeeID: '0010',
    Name: 'Bob',
    Surname: 'Smith',
    Balance: 0,
    Role: 'cafeteriaWorker',
    password: '0000'
}).save(function(err){
        if(err != null)
            console.log(err);
        else
            console.log("Record succefully added!");
    });

new testSchema({
    EmployeeID: '0020',
    Name: 'Jane',
    Surname: 'Doe',
    Balance: 0,
    Role: 'cafeteriaManager',
    password: '0000'
}).save(function(err){
        if(err != null)
            console.log(err);
        else
            console.log("Record succefully added!");
    });

new testSchema({
    EmployeeID: '0030',
    Name: 'Jimmuy',
    Surname: 'EatALot',
    Balance: 0,
    Role: 'normal',
    password: '0000'
}).save(function(err){
        if(err != null)
            console.log(err);
        else
            console.log("Record succefully added!");
    });


var testSchemaTwo = conn.model("inventory", new Schema({
    Name: String,
    Price: Number,
    Quantity: Number,
    Description: String
}, {versionKey: false}), "inventory");

new testSchemaTwo({
    Name: 'Lite Bite',
    Price: 20.00,
    Quantity: 50,
    Description: 'Museli and yoghurt with mixed seasonal fruits'
}).save(function(err){
       if(err != null)
           console.log(err);
       else
            console.log("Record added sucesfully!")
    });

new testSchemaTwo({
    Name: 'Grilled chicken fillets and salad',
    Price: 30.00,
    Quantity: 50,
    Description: '2 Chicken fillets with lemon and herb basting and greek salad'
}).save(function(err){
        if(err != null)
            console.log(err);
        else
            console.log("Record added sucesfully!")
    });

var testSchemaThree = conn.model("orders", new Schema({
    EmployeeID: String,
    ItemName: String,
    Quantity: Number
}, {versionKey: false}), "orders");

new testSchemaThree({
    EmployeeID: '0030',
    ItemName: "Grilled chicken fillets and salad",
    Quantity: 2
}).save(function(err){
        if(err != null)
            console.log(err);
        else
            console.log("Record added sucesfully!")
    });

new testSchemaThree({
    EmployeeID: '0040',
    ItemName: "Lite Bite",
    Quantity: 1
}).save(function(err){
        if(err != null)
            console.log(err);
        else
            console.log("Record added sucesfully!")
    });