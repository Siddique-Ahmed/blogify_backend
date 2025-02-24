import mongoose from "mongoose";

const connectDB =async () => {
  try {
    let connection ;
    connection = await mongoose.connect(process.env.MONGODB_URI)
    if(connection?.connection?.readyState == 1){
      console.log("Database connected successfully!")
    }
  } catch (error) {
    console.log(error.message);
  }
}

export default connectDB;