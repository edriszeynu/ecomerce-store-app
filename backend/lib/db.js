import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            "mongodb+srv://endriszeynu173_db_user:iYjh8QdLrilBGQ2i@cluster0.dp0cchr.mongodb.net/Cluster0"
        );

        console.log("MongoDB connected:", conn.connection.host);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};
