const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = async() => {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        dbName:"ShopHub"
    })
    .then(()=>{
        console.log("Db connected ")
    })
    .catch((error) => {
        console.log("Db connection Failed");
        console.log(error);
        process.exit(1);
    })
};