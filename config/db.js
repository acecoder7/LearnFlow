const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            "mongodb+srv://learnflow:learnflow@cluster0.o3y0dz5.mongodb.net/LearnFlow"
        );
    
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Something went wrong with the database connection");
        console.log(error);
    }
};

module.exports = connectDB;