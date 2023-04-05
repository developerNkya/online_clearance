
const express = require('express')
const router = express.Router()
var mysql = require('mysql');

const con = require('./connection')
var flash = require('connect-flash');
const xlsx = require('xlsx');

var session;


// simple change to test termux

// helperFunctions:::
const userExists = require('./middlewares/userExists');
const dbPostsQuerries = require('./middlewares/dbPostQueries');
const helperFunction= require('./middlewares/helperFunctions');

//calling the helper functions::
const isLoggedIn = helperFunction.isLoggedIn;

const homeRedirect = helperFunction.homeRedirect;
const roleCheker = helperFunction.roleCheker;
const fetchUserDetails = helperFunction.fetchUserDetails;
const adminEditPage = helperFunction.adminEditPage;
const staffCheker = helperFunction.staffCheker;
const studentCheker = helperFunction.studentCheker;

// Home route
router.get('/',isLoggedIn,homeRedirect,(req, res) => {
        // This is the default home route.it will change depending on where the user
        //logged in and his role
  })
  
  //login form 
router.get('/loginForm',(req, res) => {
      //the default login form
      failedLogin=req.flash('message');
      console.log(failedLogin)
      res.render('index.ejs',{message: failedLogin});
     
  })
  
  
router.post('/login', (req, res) => {  
//    selecting all rows from the database::
     var registration = req.body.registrationNo ;
     var password = req.body.password ;
   //cheking if values exists::
   con.query("SELECT * FROM STAFF WHERE REG_NO=? AND PASS=?",[registration,password],function (err,rows) {
    if (err) throw err;
  //  check if fields exist in the database
  if(rows.length < 1){
      // credidentials do not match
//req.flash('message', 'Incorrect credidentials,Try agai'); 
  
   //check if user is student.
   con.query("SELECT * FROM STUDENTS WHERE REGISTRATION=? AND PASSWORD=?",[registration,password],function (err,rows) {
     if (err) throw err;
     else if (rows.length <1){
       res.redirect('/')
     }else{
       //adding student details to session
       
       session=req.session;
       session.userid=req.body.registrationNo;
        
        session.userRole = 'STUDENT';
        console.log(session)
        
        res.redirect('/')
            
     }
   })
   
  }else{
//cheking the role:::
        session=req.session;
        session.userid=req.body.registrationNo;
        
        session.userRole =rows[0].ROLE;
            
       // console.log(req.session)
  res.redirect('/')

  }
  
  // if yes..then login,else redirect to login screen.
  })

  })

//logout
router.post('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
  
  
  // Route for accountant home:
router.get('/accountant_home',(req,res)=>{
    res.render('Accountant/Home/Accountant_home.ejs')
  })
  
  // Route for accountant edit Homepage
router.get('/accountant_edit',(req,res)=>{
    res.render('Accountant/Edit_Page/Accountant_edit.ejs')
  })
  
  // accountant post rout after Edit_Page
router.post('/accountant_edit_form',(req,res)=>{
    res.redirect('/accountant_home')
  })
  
  // Dean home::::
router.get('/dean_home',(req,res)=>{
    res.render('Dean/Dean_Home/Dean_Home.ejs')
  })
  
  // Dean edit Edit_Page
router.get('/dean_edit',(req,res)=>{
   res.render('Dean/deanEdit/Dean_edit.ejs')
  })
  
router.post('/dean_edit_form',(req,res)=>{
   res.redirect('/Dean_home')
  })
  
  //For Hod home
router.get('/hod_home',(req,res)=>{
   res.render("HOD/hodHome/hodHome.ejs")
  })
  
  // hod edit page:
router.get('/hod_edit',(req,res)=>{
   res.render("HOD/hodEdit/hodEdit.ejs")
  })
  
  //hod edit post:
router.post('/hod_edit_post',(req,res)=>{
   res.redirect("/hod_home")
  })
  
  // library home:
router.get('/library_home',(req,res)=>{
   res.render("Library/libraryHome/home.ejs")
  })
  
 //library edit::
router.get('/library_edit',(req,res)=>{
   res.render("Library/libraryEdit/libraryEdit.ejs")
  })
  
  //library edit post
router.post('/library_edit_post',(req,res)=>{
   res.redirect("/library_home")
  })
  
  //administrator home
router.get('/administrator_home',isLoggedIn,roleCheker('Administrator'),(req,res)=>{
  res.render("Administrator/Home/homeContent.ejs")
  })
  
  //staff home page
router.get('/staff_home',
isLoggedIn,staffCheker,
(req,res)=>{
 userReg = req.session.userid;
 console.log(userReg);
 
 res.render("StaffPages/Home/homeContent.ejs"),{
   userReg : userReg
 }
  })
  
  // student home:
 router.get('/student_home',
isLoggedIn,studentCheker,
(req,res)=>{
 userReg = req.session.userid;
 console.log(userReg);
 
 res.render("Students/Home/homeContent")
 //res.render("StaffPages/Home/homeContent.ejs"),{
 //  userReg : userReg
 // }
  })
  
  // student View clearance
  router.get('/studentView_clearance',
isLoggedIn,studentCheker,
(req,res)=>{
 userReg = req.session.userid;
 console.log(userReg);
 //getting the data of the student:
con.query(" SELECT * FROM STUDENTS WHERE REGISTRATION=? ",[userReg],function(err,rows){
  if (err) throw err;
  else{
    //send the data to front end:
    var Overall = [];
    
    //listing the rows::
    var deanStatus = rows[0].DEAN;
    var ACCOUNTANT = rows[0].ACCOUNTANT;
    var HOD = rows[0].HOD;
    var LIBRARIAN = rows[0].LIBRARIAN;
    
    if(deanStatus == 'CONFIRMED' && ACCOUNTANT == 'CONFIRMED' && HOD == 'CONFIRMED' && LIBRARIAN== 'CONFIRMED'){
              Overall.push('CONFIRMED');
    }else{
       Overall.push('NOT VERIFIED');
    }
    
    console.log(Overall);
    res.render("Students/ClearancePage/ClearancePage.ejs",{
   USER : rows[0],
   OVERALL : Overall
   
  })
    
  }
})
 
 
 
  })
  
  //
// router.get('/staffView_Students',
// isLoggedIn,staffCheker,
// (req,res)=>{


// con.query(" SELECT * FROM STUDENTS ",function(err,rows){
//     if (err) throw err;
//   userRole = req.session.userRole;
//   userRole1 = userRole.toUpperCase();
   
//    var status = [];
//    if(userRole1 == 'DEAN'){
//      rows.forEach((row,index)=>{
//        status.push(
//          Object.values(row)[8]
//          )
//      })
//    }else if(userRole1 == 'ACCOUNTANT'){
//      rows.forEach((row,index)=>{
//        status.push(
//          Object.values(row)[9]
//          )
//      })
//    }else if(userRole1 == 'HOD'){
//      rows.forEach((row,index)=>{
//        status.push(
//          Object.values(row)[10]
//          )
//      })
//    }else if(userRole1 == 'LIBRARIAN'){
//      rows.forEach((row,index)=>{
//        status.push(
//          Object.values(row)[11]
//          )
//      })
//    }
  
//  // initialize a temporary object:
//  var obj = [];
//  // make loop to add items to object::
// rows.forEach((row,index) => {
//     obj.push(
//          {
//           "ID":Object.values(row)[0],
//           "FIRSTNAME":Object.values(row)[1],
//           "MIDDLENAME":Object.values(row)[2],
//           "LASTNAME":Object.values(row)[3],
//           "REGISTRATION":Object.values(row)[4],
//           "COURSE":Object.values(row)[7],
//           "LEVEL":Object.values(row)[6],
//           "STATUS" : status[index]
//          }
         
//       )
// });
//    console.log(Math.random());
//     console.log(rows);

//     // 
//     res.send(obj);
//     //  res.render("StaffPages/Students/viewStudents/Table.ejs",
//     // {
//     //    USER : obj,
//     //   USER_ROLE : userRole1
//     // })
//   });

//   })
  

router.get('/staffView_Students',
isLoggedIn,staffCheker,
(req,res)=>{
  userRole = req.session.userRole;
  userRole1 = userRole.toUpperCase();

 



// Cheking first the user Role:::
if (userRole1 == 'DEAN') {
  staff_view_students('CONFIRMED','UnApproved','CONFIRMED','UnApproved',8)

}else if(userRole1 == 'ACCOUNTANT'){
  staff_view_students('CONFIRMED','UnApproved','UnApproved','UnApproved',9)

}else if(userRole1 == 'HOD'){
  staff_view_students('CONFIRMED','CONFIRMED','CONFIRMED','UnApproved',10)

}else if(userRole1 == 'LIBRARIAN'){
  staff_view_students('UnApproved','UnApproved','UnApproved','UnApproved',11)
}


function staff_view_students(library_value,dean_value,accountant_value,hod_value,num) {
  console.log('role is:'+userRole1);

  con.query(` SELECT * FROM students WHERE LIBRARIAN =? AND ACCOUNTANT =? AND DEAN=? AND HOD=? `,[library_value,accountant_value,dean_value,hod_value],function(err,rows){
    if (err) throw err;

     var status = [];
      rows.forEach((row,index)=>{
     status.push(
       Object.values(row)[num]
       )
   })
  console.log('getting status:::');

   console.log(status);

  //  rows here:::
 // initialize a temporary object:
 var obj = [];
 // make loop to add items to object::
rows.forEach((row,index) => {
    obj.push(
         {
          "ID":Object.values(row)[0],
          "FIRSTNAME":Object.values(row)[1],
          "MIDDLENAME":Object.values(row)[2],
          "LASTNAME":Object.values(row)[3],
          "REGISTRATION":Object.values(row)[4],
          "COURSE":Object.values(row)[7],
          "LEVEL":Object.values(row)[6],
          "STATUS" : status[index]
         }
         
      )
});
   console.log(Math.random());
    console.log(rows);

    // 
  
     res.render("StaffPages/Students/viewStudents/Table.ejs",
    {
       USER : obj,
      USER_ROLE : userRole1
    })

   
  })

  
}


  })
  
router.get('/administrator_view_students',isLoggedIn,roleCheker('Administrator'),
(req,res)=>{

  // declaring the pagination concept:
  const page = parseInt(req.query.page) || 1;
  // const perPage = parseInt(req.query.perPage) || 10;
  const perPage = 5;
  const offset = (page - 1) * perPage;

  // selecting from db
  con.query(" SELECT * FROM STUDENTS LIMIT ? OFFSET ? ",[perPage, offset],function(err,rows){
    if (err) throw err;

    // getting the values:
    con.query(" SELECT COUNT(*) AS count FROM STUDENTS",function(err,count){
      if (err) throw err;
  
      // getting the count:

  const pageCount = Math.ceil(count[0].count / perPage);

  res.render('Administrator/Students/viewStudents/Table.ejs', {
    rows,
    pageCount,
    currentPage: page
  });
  
    });
  });

});

// Router to handle pagination:::
router.get('/test_pagination',(req,res)=>{

  // declaring the pagination concept:
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const offset = (page - 1) * perPage;

  // selecting from db
  con.query(" SELECT * FROM STUDENTS LIMIT ? OFFSET ? ",[perPage, offset],function(err,rows){
    if (err) throw err;

    // getting the values:
    con.query(" SELECT COUNT(*) AS count FROM STUDENTS",function(err,count){
      if (err) throw err;
  
      // getting the count:

  const pageCount = Math.ceil(count[0].count / perPage);

  res.render('Administrator/Students/viewStudents/test.ejs', {
    rows,
    pageCount,
    currentPage: page
  });
  
    });
  });

});






  // administrator add new student::
router.get('/administrator_add_students',isLoggedIn,roleCheker('Administrator'),(req,res)=>{
  res.render("Administrator/Students/addStudents/administratorAddStudent.ejs")
  })

  // administrator Post students
  router.post('/administrator_add_Student_POST',isLoggedIn,roleCheker('Administrator'),
  (req,res)=>{

      // getting the values::
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var registrationNo = req.body.registrationNo;
  var password = req.body.password;
  var level = req.body.level;
  var course = req.body.course;

  
  //Adding to database:::
  dbPostsQuerries.adminAddStudent(firstName,middleName,lastName,registrationNo,password,level,course);

    res.redirect('/administrator_view_students')
  })


  // Adding students through excel:::

  router.post('/administrator_add_Student_Excel_Post',isLoggedIn,roleCheker('Administrator'),
  (req,res)=>{
  const file = req.files.file;
  const workbook = xlsx.read(file.data);
  const sheet = workbook.Sheets['Sheet1'];
  const data = xlsx.utils.sheet_to_json(sheet);


  // Inserting to db:::
  const insertQuery = 'INSERT INTO STUDENTS (FIRSTNAME,MIDDLENAME,LASTNAME,REGISTRATION,PASSWORD,LEVEL,COURSE,DEAN, ACCOUNTANT,HOD,LIBRARIAN) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
  for (const record of data) {
    const values = [record.FIRSTNAME, record.MIDDLENAME,record.LASTNAME,record.REGISTRATION,record.PASSWORD,record.LEVEL,record.COURSE,record.DEAN,record.ACCOUNTANT,record.HOD,record.LIBRARIAN];
    con.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Record inserted:', result.insertId);
      
      }
    });
  }

   
  res.redirect('/administrator_view_students')
  })


    // administrator view librarian
router.get('/administrator_view_Librarian',isLoggedIn,roleCheker('Administrator'),
fetchUserDetails('Librarian'),
(req,res)=>{
        //handled in the helper function
  });


      // administrator edit librarian
router.get('/administrator_edit_librarians',(req,res)=>{
  
  res.render('Administrator/Librarians/editLibrarians/editLibrarians.ejs') 

  })

      // administrator add librarians
router.get('/administrator_add_staff',
isLoggedIn,roleCheker('Administrator'),
(req,res)=>{
  res.render("Administrator/staff/addStaff/addStaff.ejs")
  })

        // administrator add librarians POST
router.post('/administrator_add_Staff_POST',isLoggedIn,roleCheker('Administrator'),
(req,res)=>{
  // getting the values::
  var firstName = req.body.firstName;
  var secondName = req.body.secondName;
  var regNo = req.body.regNo;
  var pass = req.body.pass;
  var role = req.body.role;
  
            con.query("INSERT INTO STAFF (FIRST_NAME,LAST_NAME,REG_NO,PASS,ROLE) VALUES (?,?,?,?,?) ",[firstName,secondName,regNo,pass,role],(err,rows)=>{
              if (err) throw err;
              else{
                

              // redirecting to the particular route:::
                      // check role and redirect to specific page:::
              var role = req.body.role;
              if (role == 'Librarian') {
              url_redirect('/administrator_view_Librarian')
              } else if(role == 'Dean'){
              url_redirect('/administrator_view_Dean')
              }else if(role == 'HOD'){
              url_redirect('/administrator_view_HOD')
              }else if(role == 'Accountant'){
              url_redirect('/administrator_view_Accountant')
              }


                    // This function will aid moving to specific route basing on the entered role::::
              function url_redirect(url) {
                res.redirect(url)
              }
              }
            });

  })


// adding staff through excel:::

router.post('/administrator_add_Staff_Excel_POST',isLoggedIn,roleCheker('Administrator'),
(req,res)=>{

  const file = req.files.file;
  const workbook = xlsx.read(file.data);
  const sheet = workbook.Sheets['Sheet1'];
  const data = xlsx.utils.sheet_to_json(sheet);


    // Inserting to db:::
    const insertQuery = 'INSERT INTO STAFF (FIRST_NAME,LAST_NAME,REG_NO,PASS,ROLE) VALUES (?,?,?,?,?) ';
    for (const record of data) {
      const values = [record.FIRST_NAME, record.LAST_NAME,record.REG_NO,record.PASS,record.ROLE];
      con.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error(err);
        } else {
        
        // check role and redirect to specific page:::
        var role = record.ROLE;
         if (role == 'Librarian') {
          url_redirect('/administrator_view_Librarian')
         } else if(role == 'Dean'){
          url_redirect('/administrator_view_Dean')
         }else if(role == 'HOD'){
          url_redirect('/administrator_view_HOD')
         }else if(role == 'Accountant'){
          url_redirect('/administrator_view_Accountant')
         }

        // This function will aid moving to specific route basing on the entered role::::
        function url_redirect(url) {
          console.log('Record inserted:', result.insertId);
          res.redirect(url)
        }

        }
      });
    }


  })
  

  //administrator view deans
    // 
router.get('/administrator_view_Dean',isLoggedIn,roleCheker('Administrator'),
fetchUserDetails('Dean'),
(req,res)=>{
       // handled in helperFunction
  });
  
  //administrator view accountant
router.get('/administrator_view_Accountant',isLoggedIn,roleCheker('Administrator'),
fetchUserDetails('Accountant'),
(req,res)=>{
       // handled in helperFunction
  });

  //administrator view HOD
  router.get('/administrator_view_HOD',isLoggedIn,roleCheker('Administrator'),
fetchUserDetails('HOD'),
  (req,res)=>{
   //handled in helper function
    })
  
  //testing route

    
    //students editing page
router.post('/administrator_edit_students',
isLoggedIn,roleCheker('Administrator'),
  (req,res,next)=>{
    regNo=req.body.regNo;
            con.query("SELECT * FROM STUDENTS WHERE REGISTRATION=?",[regNo],(err,rows)=>{
              if (err) throw err;
              else{
                console.log(rows)
             res.render('Administrator/Students/editStudents/editStudents.ejs',
                {
                  USER : rows[0]
                }
             )
              }
            });
           
   
    })
    
    //staff edit page
router.post('/staff_edit_students',
isLoggedIn,staffCheker,
  (req,res,next)=>{
    regNo=req.body.regNo;
            con.query("SELECT * FROM STUDENTS WHERE REGISTRATION=?",[regNo],(err,rows)=>{
              if (err) throw err;
              else{
              
               userRole = req.session.userRole;
               userRole1 = userRole.toUpperCase();
   
   var status = [];
   if(userRole1 == 'DEAN'){
     rows.forEach((row,index)=>{
       status.push(
         Object.values(row)[8]
         )
     })
   }else if(userRole1 == 'ACCOUNTANT'){
     rows.forEach((row,index)=>{
       status.push(
         Object.values(row)[9]
         )
     })
   }else if(userRole1 == 'HOD'){
     rows.forEach((row,index)=>{
       status.push(
         Object.values(row)[10]
         )
     })
   }else if(userRole1 == 'LIBRARIAN'){
     rows.forEach((row,index)=>{
       status.push(
         Object.values(row)[11]
         )
     })
   }
         console.log(Math.random(3));
          console.log(status);
             res.render('StaffPages/Students/editStudents/editStudents.ejs',
                {
                  USER : rows[0],
                  STATUS : status[0]
                }
             )
              }
            });
           
   
    })
    
    //edit student post
router.post('/administrator_edit_Student_POST',isLoggedIn,roleCheker('Administrator'),
(req,res)=>{
  // getting the values::
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var registrationNo = req.body.registrationNo;
  var password = req.body.password;
  var level = req.body.level;
  var course = req.body.course;
 var ID = req.body.ID;
  
            con.query("UPDATE STUDENTS  SET FIRSTNAME=?,MIDDLENAME=?,LASTNAME=?, REGISTRATION=?,PASSWORD=?,LEVEL=?,COURSE=? WHERE ID =? ",[firstName,middleName,lastName,registrationNo,password,level,course,ID],(err,rows)=>{
              if (err) throw err;
              else{
                
             res.redirect('/administrator_view_students')
              }
            });

  })
  
  
  // staff edit confirmation status.
  //here1
router.post('/staff_edit_Student_POST',
isLoggedIn,staffCheker,
(req,res)=>{
  //the user role.
  userRole = req.session.userRole;
  userRole1 = userRole.toUpperCase();
  
  // getting the values::
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var registrationNo = req.body.registrationNo;
  var level = req.body.level;
  var course = req.body.course;
 var ID = req.body.ID;
           console.log(ID)
           console.log(userRole1)
           console.log(level)
            con.query(`UPDATE STUDENTS  SET ${userRole1}=?  WHERE ID =? `,[level,ID],(err,rows)=>{
              if (err) throw err;
              else{
              
             res.redirect('/staffView_Students')
              }
            });

  })
  
  
  
  
  
  
 //administrator edit users Page
  //testing route
router.post('/administrator_edit_users',
isLoggedIn,roleCheker('Administrator'),
  (req,res,next)=>{
    regNo=req.body.regNo;
            con.query("SELECT * FROM STAFF WHERE REG_NO=?",[regNo],(err,rows)=>{
              if (err) throw err;
              else{
                console.log(rows[0])
             res.render('Administrator/staff/editStaff/editStaff.ejs',
                {
                  USER : rows[0]
                }
             )
              }
            });
           
   
    })
    
    
    //editing user info
router.post('/administrator_edit_Staff_POST',isLoggedIn,roleCheker('Administrator'),
(req,res)=>{
  // getting the values::
  var firstName = req.body.firstName;
  var secondName = req.body.secondName;
  var regNo = req.body.regNo;
  var pass = req.body.pass;
  var role = req.body.role;
  var ID = req.body.ID;
  
            con.query("UPDATE STAFF  SET FIRST_NAME=?,LAST_NAME=?,REG_NO=?,PASS=?,ROLE=? WHERE ID =? ",[firstName,secondName,regNo,pass,role,ID],(err,rows)=>{
              if (err) throw err;
              else{
                
             res.redirect(`/administrator_view_${role}`)
              }
            });

  })
  

  module.exports = router