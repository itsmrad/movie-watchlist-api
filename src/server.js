import { config } from "dotenv";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";

config();

const app = express();

app.use(express.json());

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

app.get("/hello", (req, res) => {
	res.json({
		message: "Hello",
	});
});

const PORT = 5001;

const server = app.listen(PORT, () => {
	console.log(`Server running on Port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
	console.log("Unhandled Rejection: ", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});

process.on("uncaughtException", async (err) => {
	console.log("UncaughtException: ", err);
	await disconnectDB();
	process.exit(1);
});

process.on("SIGTERM", () => {
	console.log("SIGTERM RECEIVED, shutting down gracefully");
	server.close(async () => {
		await disconnectDB();
		process.exit(0);
	});
});
