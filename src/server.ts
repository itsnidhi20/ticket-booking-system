import dotenv from "dotenv";
import app from "./app";
import { pool } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await pool.query("SELECT NOW()");
        console.log("✅ Database connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Database connection failed", err);
    }
}

startServer();