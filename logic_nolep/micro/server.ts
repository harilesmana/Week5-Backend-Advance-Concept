import { Elysia } from "elysia";
import dotenv from "dotenv";
import { paymentRouter } from "./src/routes/payment";
import { userRouter } from "./src/routes/user";

dotenv.config();

const app = new Elysia()
  .use(paymentRouter)
  .use(userRouter)
  .listen(3000);

console.log(`🚀 Server berjalan di http://localhost:3000`);
