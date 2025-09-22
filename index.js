const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { PORT, MONGODB_URL } = process.env;
const port = PORT || 8000;
const authRouter = require("./Routes/Auth/auth.routes");
const campaignRouter = require("./Routes/Campaign/campaign.routes");
const donationRouter = require("./Routes/Donation/donor.routes");
const dashboardRouter = require("./Routes/Dashboard/dashboard.routes");
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URL)
  .then((res) => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

// Routes

app.use("/api", authRouter);
app.use("/api/campaign", campaignRouter);
app.use("/api/donations", donationRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("server is online");
});

app.listen(port, () => {
  console.log(`Your server is online at http://localhost:${port}`);
});
