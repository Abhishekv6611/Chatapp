import mongoose from 'mongoose'

export const ConnectDb=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB)
        console.log(`mongodb connected :${conn.connection.host}`);    
    } catch (error) {
        console.log(error);
        
    }
}