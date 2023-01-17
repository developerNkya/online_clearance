const express = require('express')
const router = express.Router()
var mysql = require('mysql');
const con = require('../connection')

//linking with db querries
const dbPostsQuerries = require('./dbPostQueries');


module.exports = {
  //check if user is logged in ::
isLoggedIn:function (req,res,next){
  //if something is empty then return to home.
  //check if session id exists
    sessionv=req.session.userid;
    if(sessionv){
        next();
        
    }else{
   // req.flash('message', 'Login to Proceed.. !!'); 
    res.redirect('/loginForm');
    }
   
},

// student checker:
studentCheker:function (req,res,next){
  //getting the session id.
      sessionId = req.session.userid;
      // Querry the role of the sessionId:
        con.query("SELECT * FROM STAFF WHERE REG_NO=?",sessionId,function(err,rows){
        if (err) throw err;
        else{
          
          if(rows.length >0){
          
            next();
          }else{
           //cheking if user is student:::
           con.query("SELECT * FROM STUDENTS WHERE REGISTRATION=?",sessionId,function(err,rows){
             if (err) throw err;
             else if(rows.length>0){
               next();
             }else{
               res.redirect('/loginForm')
             }
           })
           
            
          }
        }
      })

   
},




//handle the default homepage (/) when user is signed in ::
homeRedirect:function (req,res,next){
  //getting the session id.
      sessionId = req.session.userid;
      // Querry the role of the sessionId:
        con.query("SELECT ROLE FROM STAFF WHERE REG_NO=?",sessionId,function(err,rows){
        if (err) throw err;
        else if(rows.length > 0){
          userRole =rows[0].ROLE;
          userRole1 = userRole.toUpperCase();
         
          if(userRole=='Administrator'){
            res.redirect('/administrator_home')
          }else if (userRole1 == 'DEAN' || 'LIBRARIAN' || 'ACCOUNTANT' || 'HOD'){
            
            res.redirect('/staff_home')
          }
        }
        else{
            console.log('passed home redirect')
            res.redirect('/student_home')
          }
    })

},
//check if user can view the requested page:
roleCheker:function (roleValue){
      return async(req,res,next)=>{
  //getting the session id.
      sessionId = req.session.userid;
      // Querry the role of the sessionId:
        con.query("SELECT ROLE FROM STAFF WHERE REG_NO=?",sessionId,function(err,rows){
        if (err) throw err;
        else{
          userRole =rows[0].ROLE;
          if(userRole==roleValue){
          
            next();
          }else{
           
            res.redirect('/loginForm')
          }
        }
      })

    }

},

//staff checker
staffCheker:function(req,res,next){
  //getting the session id.
      sessionId = req.session.userid;
      // Querry the role of the sessionId:
        con.query("SELECT ROLE FROM STAFF WHERE REG_NO=?",sessionId,function(err,rows){
        if (err) throw err;
        else{
          
          if(rows.length >0){
          
            next();
          }else{
           
            res.redirect('/loginForm')
          }
        }
      })

    },

fetchUserDetails: function(role){
  return async(req,res,next)=>{
  con.query(" SELECT * FROM STAFF WHERE ROLE=?",[role],function(err,rows){
    if (err) throw err;
    else{
req.userDetails = rows;
   res.render('Administrator/staff/viewStaff/viewStaff.ejs',
    {
      USER : rows,
      ROLE : role
    })
    }
       

  });

  }
},

// editing user details(Admins role)::
adminEditPage: function(regNo){
  return async(req,res,next)=>{
  con.query(" SELECT * FROM STAFF WHERE REG_NO=?",[regNo],function(err,rows){
    if (err) throw err;
    else{
   
   res.render('Administrator/staff/editStaff/editStaff.ejs',
    {
      USER : rows,
     
    })
    }
       

  });

  }
}



}