import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isDev = process.env.NODE_ENV !== "production";

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: isDev
      ? true
      : (origin, cb) => {
          if (!origin) return cb(null, true);
          const allowed = [
            "https://orbitfuture.com",
            "https://www.orbitfuture.com",
            "https://fairy-2ff969.netlify.app",
            ...ALLOWED_ORIGINS,
          ];
          if (allowed.some((o) => origin.startsWith(o))) {
            cb(null, true);
          } else {
            cb(new Error("CORS: origin not allowed"));
          }
        },
    credentials: true,
  })
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

// Redirect non-www to www for spacexstarlink.com
app.use((req, res, next) => {
  const host = req.headers.host ?? "";
  if (host === "spacexstarlink.com" || host === "spacexstarlink.com:443") {
    res.redirect(301, `https://www.spacexstarlink.com${req.url}`);
    return;
  }
  next();
});

// Stripe webhooks need raw body for signature verification
app.use("/api/stripe-webhook", express.raw({ type: "application/json" }));

// Standard JSON parsing for all other routes
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use("/api", router);

export default app;
