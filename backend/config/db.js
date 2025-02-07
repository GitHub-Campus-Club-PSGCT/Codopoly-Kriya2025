const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected!! ${conn.connection.host}/${conn.connection.name}`);
    }catch(err){
        console.log(`error : ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;