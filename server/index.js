const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { clerkMiddleware } = require("@clerk/express");
const dbconnect = require("./configs/mongodb");
const { clerkWebhooks, stripeWebhooks } = require("./controllers/WebHooks");
const educatorRouter = require("./routes/educatorRoutes");
const courseRouter = require("./routes/courseRoutes");
const { connectCloudinary } = require("./configs/cd"); 
const userRouter = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Initialize services
dbconnect();
connectCloudinary();


app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);


app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());


app.get("/", (req, res) => res.send("API working"));

app.use("/api/user", userRouter);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);


app.use((err, req, res, next) => {
  console.error("Middleware error:", err);
  res.status(500).json({ success: false, message: err.message });
});


app.listen(port, () => {
  console.log(`Server live on port ${port}`);
});
