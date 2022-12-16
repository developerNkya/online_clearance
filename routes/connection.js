var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database:"clearance_form"
})

module.exports = con;