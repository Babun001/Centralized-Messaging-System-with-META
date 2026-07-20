import dotenv from 'dotenv';
dotenv.config();


import type { Request, Response } from 'express';
import express from 'express';
import webhookroute from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/webhook',webhookroute);

// Basic Route with explicit TypeScript types
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'TypeScript Node.js Server is running smoothly!' });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});