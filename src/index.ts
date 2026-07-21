import dotenv from "dotenv";
dotenv.config();

// console.log("verify token:", process.env.VERIFY_TOKEN);

import express, {
    type Request,
    type Response,
    type NextFunction
} from "express";

import { createServer } from "http";
import { initSocket } from "./socket.js";
import webhookroute from "./routes/routes.js";
import dbconnection from './db/connection.db.js';


const app = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
initSocket(httpServer);
app.use(express.json());

app.use(
    (req: Request, res: Response, next: NextFunction) => {

        console.log("====================================");
        console.log(`📩 ${req.method} ${req.originalUrl}`);
        console.log("Time:", new Date().toISOString());
        console.log("====================================");

        next();
    }
);


app.use("/webhook", webhookroute);
app.get("/", (req: Request, res: Response) => {

    res.status(200).json({
        success: true,
        message: "TypeScript Node.js Server is running smoothly!"
    });

});

app.use(
    (req: Request, res: Response) => {

        res.status(404).json({
            success: false,
            message: "Route Not Found"
        });

    }
);

const startServer = async () => {
    try {
        console.log("Connecting to DB...");
        await dbconnection();

        console.log("DB connected");

        // Start server
        httpServer.listen(PORT, () => {

            console.log("====================================");
            console.log(`🚀 Server Running`);
            console.log(`Port : ${PORT}`);
            console.log(`Webhook : /webhook`);
            console.log(`Socket.io : Enabled`);
            console.log("====================================");

        });

    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    }
};

startServer();


