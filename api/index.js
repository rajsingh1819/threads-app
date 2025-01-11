const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const userRouter  = require("./routes/auth-routes");
const userPostRouter  = require("./routes/post-routes");


app.use(cors());
app.use(express.json());
require("dotenv").config();

const DB = process.env.DB; //if you want to pass mongo link in .env then you can pass.

mongoose.connect("mongodb+srv://rajsingh:DYLq2HlWCEScya89@cluster0.oug8w.mongodb.net/threads", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error Connecting to MongoDB");
  });

const PORT = process.env.PORT || 3000;

app.use("/api/auth",userRouter);
app.use("/api/posts",userPostRouter);




//  use can use this one otherwise see in bootom one
// app.listen(PORT, () => {
//   console.log(`Server is running on http://3000:${PORT}`);
// });




// some time it's need in recat native
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});