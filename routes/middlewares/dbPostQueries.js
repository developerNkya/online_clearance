const express = require('express')
const router = express.Router()
var mysql = require('mysql');
const con = require('../connection')




module.exports = {
    adminAddStaff: function(firstName,secondName,regNo,pass,role){
                 return async(req,res,next)=>{

                 }
        //adding to the database:::::
        


    },
    adminAddStudent: function(firstName,middleName,lastName,registrationNo,level,course){

        //adding to the database:::::
        con.query("INSERT INTO STUDENTS (FIRSTNAME,MIDDLENAME,LASTNAME,REGISTRATION,LEVEL,COURSE) VALUES (?,?,?,?,?,?) ",[firstName,middleName,lastName,registrationNo,level,course]);


    },
    adminLibrarians: function(firstName,middleName,lastName,registrationNo,level,course){

        //adding to the database:::::
        con.query(" SELECT * FROM users WHERE ROLE=Librarian ");


    },
    
    
 
}