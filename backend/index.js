const express = require('express');

const env = require('dotenv');
env.config();
const PORT = process.env.PORT;

const app = express();


app.get('/',(req,res)=>{
    res.send('<h1>Hello this is home route!</h1>')
})




app.listen(PORT || 3333, ()=>{
    console.log(`Server is running on PORT: ${PORT}!`);
})