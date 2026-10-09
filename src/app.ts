import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler, notFoundHandler } from "../src/middlewares/errorHandler.js";
import { ApiResponse } from "../src/utils/ApiResponse.js";
import v1Router from "../src/routes/v1/index.js";
import { webhookRouter } from "./modules/payment/payment.routes.js";


const app = express();

app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Must be mounted BEFORE express.json(), otherwise Stripe's raw body gets parsed and signature verification fails
app.use("/api/v1/payments/webhook", webhookRouter);

app.use(express.json());

app.get("/health", (_req, res) => res.json(ApiResponse.success({ status: "up" })));
app.use("/api/v1", v1Router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;