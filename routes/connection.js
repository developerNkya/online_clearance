var mysql = require('mysql')

var con = mysql.createConnection({
    host: "sql8.freesqldatabase.com",
    user:"sql8587032",
    password:"QjaQ6yk3et",
    port: 3306,
    database:"sql8587032"
})



module.exports = con;