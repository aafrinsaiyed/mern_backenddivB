import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const uri = process.env.USE_PROXY === "true"
            ? process.env.MONGODB_URI_PROXY
            :process.env.MONGODB_URI
        const conn = await mongoose.connect(uri)
        console.log(`connected success fully:${conn.connection.host}`)

    } catch(error){
        console.log(`connection error:${error.message}`)
    }
}

export default connectDb