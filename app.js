// declaration part
const express = require('express')
const app = express()
const port = 5000

// Sending a sample hello world::
app.get('/', (req,res)=>{
    res.send('Begining of an application')
})


// Listening at Port 3000
app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`)
})