import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`connected success fully:${conn.connection.host}`)

    } catch(error){
        console.log(`connection error:${error.message}`)
    }
}

export default connectDb