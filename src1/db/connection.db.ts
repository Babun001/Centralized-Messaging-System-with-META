import mongoose from "mongoose";

const dbconnection = async () => {
    try {
        const uri = process.env.mongoDbUrl;
        // const dbName = process.env.Db_name;
        // console.log("MongoDB URI:", uri);

        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const connectionLink = await mongoose.connect(uri);

        console.log(
            `✅ DataBase connected! Hosted at: ${connectionLink.connection.host}`
        );

    } catch (error) {
        console.error("❌ Error in DB connection:", error);
        process.exit(1);
    }

}

export default dbconnection;