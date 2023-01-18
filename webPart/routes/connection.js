var mysql = require('mysql')
require('dotenv').config()

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.PASSWORD,
    port: process.env.PORT,
    database:process.env.DB_NAME
})



module.exports = con;