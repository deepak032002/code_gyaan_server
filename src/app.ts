import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import blogRouter from "./routes/blog.routes";
import tagRouter from "./routes/tag.routes";
import categoryRouter from "./routes/category.routes";

const app: Express = express();
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/category", categoryRouter);
app.get("/", (req, res) => {
  res.status(200).send("Welcome 😊");
});
app.use((req, res) => {
  res.status(404).send({ msg: "route not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message, stack: err.stack });
});

export default app;
