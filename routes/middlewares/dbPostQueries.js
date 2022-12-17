const express = require('express')
const router = express.Router()
var mysql = require('mysql');
const con = require('../connection')




module.exports = {
    adminAddLibrarian: function(firstName,middleName,lastName,librarianType){

        //adding to the database:::::
        con.query("INSERT INTO users (USER,REGISTRATION,PASSWORD,ROLE) VALUES (?,?,?,?) ",[firstName,middleName,lastName,librarianType]);


    }
}