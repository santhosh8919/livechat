import mongoose from "mongoose";
import momgoose from "mongoose";


export const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB is ConnectedL:${conn.connection.host}`);

    }
    catch(error){
        console.log("error connecting mongodb");
        process.exit(1); //1 means failure
    }
    
    }