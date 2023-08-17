const mongoose = require('mongoose');
require('dotenv').config();

// const mongoURI = "mongodb://127.0.0.1:27017/inotebook?retryWrites=true&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000"
const URI = process.env.MONGO_URI;
connectToMongo = () => {
    mongoose.connect(URI).then((res) => {
        console.log("Database connected");
    }).catch(error => {
        console.log(error);
    });
}
module.exports = connectToMongo;