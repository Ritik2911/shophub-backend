const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/User');
const {connect} = require('./config/database');
require('dotenv').config();
const cors = require('cors');

const app =  express();
app.use(cors());

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

connect(); 

// router
app.use('/api/auth',userRoutes);

app.get('/',(req,res) => {
    return res.json({
        success:true,
        message:"your server is up and running"
    })
});

app.listen(PORT, () => {
    console.log("APP started at: ",PORT)
});
