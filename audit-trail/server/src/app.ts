import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Audit Trail API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/shipments", shipmentRoutes);

export default app;