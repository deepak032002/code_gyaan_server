import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import blogRouter from "./routes/blog.routes";
import tagRouter from "./routes/tag.routes";

const app: Express = express();
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/tag", tagRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello 🙂");
});

export default app;