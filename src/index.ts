import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response, type NextFunction } from "express";
import webhookroute from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON body
app.use(express.json());

// Log every incoming request
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("====================================");
    console.log(`📩 ${req.method} ${req.originalUrl}`);
    console.log("Time:", new Date().toISOString());
    console.log("====================================");
    next();
});

// Webhook Routes
app.use("/webhook", webhookroute);

// Test Route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "TypeScript Node.js Server is running smoothly!"
    });
});

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log("====================================");
    console.log(`🚀 Server Running`);
    console.log(`Port : ${PORT}`);
    console.log(`Webhook : /webhook`);
    console.log("====================================");
});