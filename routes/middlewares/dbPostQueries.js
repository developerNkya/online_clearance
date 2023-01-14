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
    adminAddStudent: function(firstName,middleName,lastName,registrationNo,password,level,course){
       var val = 'UnApproved';
        //adding to the database:::::
        con.query("INSERT INTO STUDENTS (FIRSTNAME,MIDDLENAME,LASTNAME,REGISTRATION,PASSWORD,LEVEL,COURSE,DEAN, ACCOUNTANT,HOD,LIBRARIAN) VALUES (?,?,?,?,?,?,?,?,?,?) ",[firstName,middleName,lastName,registrationNo,password,level,course,val,val,val,val]);


    },
    adminLibrarians: function(firstName,middleName,lastName,registrationNo,level,course){

        //adding to the database:::::
        con.query(" SELECT * FROM users WHERE ROLE=Librarian ");


    },
    
    
 
}