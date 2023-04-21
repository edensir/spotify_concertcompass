import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DB}`);
        console.log('connected to database successfully');
    } catch (error) {
        console.log('could not connect to database: ', error);
    }
}

