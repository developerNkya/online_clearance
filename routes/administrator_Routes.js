const express = require('express')
const router = express.Router()
var mysql = require('mysql');
const con = require('./connection')
var flash = require('connect-flash');

// administrator
  // home
  router.get('/administrator_home',(req,res)=>{
  // res.render("Administrator/Home/Header.ejs")
  res.send('ok');
  })
  
module.exports = administrator_Routes;