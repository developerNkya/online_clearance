// declaration part
const express = require('express')
const app = express()
const port = 5000
const fileUpload = require('express-fileupload');

var flash = require('connect-flash');
var sessions = require('express-session')


const cookieParser = require("cookie-parser");
 
// it will be used for displaying flash messages



// declaring the routes path
const routes = require('./routes/routes');
const login = require('./routes/login');


const path = require('path');


// The body parser is used to fetch input fields such as of forms:::

var bodyParser = require('body-parser');
const { allowedNodeEnvironmentFlags } = require('process');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(flash()); 

app.use(fileUpload());
// declaring the views path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// declaring the public assests files...like CSS.
app.use(express.static(path.join(__dirname, 'public')));


//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));


// We are going to have many routes in our project. Thats why we moved all routes to separate folder.

app.use('/', routes)
app.use('/login',login)
// Listening at Port 3000
 var server = app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`)
})

server.timeout = 1000;

