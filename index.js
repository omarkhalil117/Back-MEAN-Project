require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Conncted to database")
})
.catch((err)=>{
    console.log(err.message)
})

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
