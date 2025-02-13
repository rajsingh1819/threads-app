const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


const userRouter = require("./routes/auth-routes");
const userPostRouter = require("./routes/post-routes");
const forgotPasswordRoutes = require("./routes/forgotPassword-route");

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.DB , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error Connecting to MongoDB:", err));

// Routes
app.use("/api/auth", userRouter);
app.use("/api/posts", userPostRouter);
app.use("/api/forgot", forgotPasswordRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
