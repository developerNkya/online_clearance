const express = require('express')
const router = express.Router()
var mysql = require('mysql');
const con = require('../connection')




module.exports = {
    adminAddStaff: function(firstName,middleName,lastName,librarianType){

        //adding to the database:::::
        con.query("INSERT INTO users (USER,REGISTRATION,PASSWORD,ROLE) VALUES (?,?,?,?) ",[firstName,middleName,lastName,librarianType]);


    },
    adminAddStudent: function(firstName,middleName,lastName,registrationNo,level,course){

        //adding to the database:::::
        con.query("INSERT INTO students (FIRSTNAME,MIDDLENAME,LASTNAME,REGISTRATION,level,course) VALUES (?,?,?,?,?,?) ",[firstName,middleName,lastName,registrationNo,level,course]);


    },
    adminLibrarians: function(firstName,middleName,lastName,registrationNo,level,course){

        //adding to the database:::::
        con.query(" SELECT * FROM users WHERE ROLE=Librarian ");


    },
    
    
   


}