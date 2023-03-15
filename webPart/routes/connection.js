var mysql = require('mysql')
require('dotenv').config()

var con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database:"online_clearance"
})


con.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });


module.exports = con;