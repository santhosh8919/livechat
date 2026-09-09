import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;


export const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB is ConnectedL:${conn.connection.host}`);

    }
    catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        if (process.env.NODE_ENV === "production") {
            process.exit(1);
        }
    }
    
    }