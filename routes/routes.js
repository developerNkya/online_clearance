const express = require('express')
const router = express.Router()
var mysql = require('mysql');
const con = require('./connection')
var flash = require('connect-flash');


// simple change to test termux
// helperFunctions:::
const userExists = require('./middlewares/userExists');
const dbPostsQuerries = require('./middlewares/dbPostQueries');



// Home route
router.get('/', (req, res) => {
    // rendering the index file here. All files to be rendered will be extracted from the views folder.
   res.render('index.ejs')
  })

//   Login POST route
router.post('/login', (req, res) => {  
//    selecting all rows from the database::
   
     var registration = req.body.registrationNo ;
     var password = req.body.password ;

   //cheking if values exists::

   con.query("SELECT * FROM users WHERE REGISTRATION=? AND PASSWORD=?",[registration,password],function (err,rows) {
    if (err) throw err;
  
  //  check if fields exist in the database
  if(rows.length < 1){
      // credidentials do not match
   
   res.redirect('/')


    
  }else{
//cheking the role:::



console.log(rows[0].ROLE)
res.redirect('/administrator_home')


  }
  
  // if yes..then login,else redirect to login screen.
  })



  })
  
  // student's homepage ::
  router.get('/student_home',(req,res)=>{
    res.render('student/Homepage/Table.ejs')
  })
  
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
router.get('/administrator_home',(req,res)=>{
  res.render("Administrator/Home/homeContent.ejs")
  })
  
  // administrator view students
router.get('/administrator_view_students',(req,res)=>{

  con.query(" SELECT * FROM students ",function(err,rows){
    if (err) throw err;

    // getting the values:::
  
    
console.log(rows);
    res.render("Administrator/Students/viewStudents/Table.ejs",
    {
      USER : rows,
    })

  });

  })
  
  // administrator add new student::
router.get('/administrator_add_students',(req,res)=>{
  res.render("Administrator/Students/addStudents/administratorAddStudent.ejs")
  })

  // administrator Post students
  router.post('/administrator_add_Student_POST',(req,res)=>{

      // getting the values::
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var registrationNo = req.body.registrationNo;
  var level = req.body.level;
  var course = req.body.course;

  console.log(firstName);
  console.log(middleName);
  console.log(lastName);


  //Adding to database:::
  dbPostsQuerries.adminAddStudent(firstName,middleName,lastName,registrationNo,level,course);

    res.redirect('/administrator_add_students')
  })


    // administrator view librarian
router.get('/administrator_view_librarians',(req,res)=>{
  //  GETTING FROM THE DATABASE::
  con.query(" SELECT * FROM users WHERE ROLE= 'Librarian'",function(err,rows){
    if (err) throw err;

    // getting the values:::
  
    

    res.render("Administrator/Librarians/viewLibrarians/Table.ejs",
    {
      USER : rows,
    })

  });

  })

      // administrator edit librarian
router.get('/administrator_edit_librarians',(req,res)=>{
  
  res.render('Administrator/Librarians/editLibrarians/editLibrarians.ejs') 

  })

      // administrator add librarians
router.get('/administrator_add_staff',(req,res)=>{
  res.render("Administrator/Librarians/addLibrarians/administratorAddLibrarians.ejs")
  })

        // administrator add librarians POST
router.post('/administrator_add_Staff_POST',(req,res)=>{
  // getting the values::
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var librarianType = req.body.librarianType;

  console.log(firstName);
  console.log(middleName);
  console.log(lastName);
  console.log(librarianType);

  //Adding to database:::
  dbPostsQuerries.adminAddStaff(firstName,middleName,lastName,librarianType);

  res.redirect('/administrator_add_staff')
  })
  

  //administrator view deans
    // administrator view students
router.get('/administrator_view_deans',(req,res)=>{

  con.query(" SELECT * FROM users WHERE ROLE = 'Dean' ",function(err,rows){
    if (err) throw err;

    // getting the values:::
  
    
console.log(rows);
    res.render("Administrator/Deans/viewDeans/Table.ejs",
    {
      USER : rows,
    })

  });

  })

  //administrator view HOD
  router.get('/administrator_view_HOD',(req,res)=>{

    con.query(" SELECT * FROM users WHERE ROLE = 'HOD' ",function(err,rows){
      if (err) throw err;
  
      // getting the values:::
    
      
  console.log(rows);
      res.render("Administrator/HOD/viewHOD/Table.ejs",
      {
        USER : rows,
      })
  
    });
  
    })
  
  
  
  

  module.exports = router