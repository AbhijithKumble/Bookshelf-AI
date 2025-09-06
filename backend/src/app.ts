import express, { json } from "express";
import cors from "cors";
import uploadImage from "./routes/uploadImage/route.ts";
import health from "./routes/health/route.ts";

const app: express.Application = express();

app.use(cors());
app.use(json());

// routes 
app.use('/api/v1/health', health);
app.use('/api/v1/uploadImage', uploadImage);

export default app;
