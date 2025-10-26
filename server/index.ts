import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.ts";
//import gameRoutes from "./src/routes/gameRoutes.ts";
import statisticsRoutes from "./src/routes/statisticsRoutes.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
//app.use("/games", gameRoutes);
app.use("/statistics", statisticsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
