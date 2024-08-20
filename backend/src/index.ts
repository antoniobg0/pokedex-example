import cors from 'cors';
import express, { Application } from "express";
import { config } from "dotenv";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/api";
import swaggerDoc from "./swagger.json";
import verifyToken from "./auth";

config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Define the CORS options
const corsOptions = {
  credentials: false,
  origin: ['http://localhost:7001'],
};

app.use(cors(corsOptions)); 

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Express middleware
app.use(express.json());

// Verify uuid in request.
app.use(verifyToken);

// API routes
app.use("/api/v1", apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
