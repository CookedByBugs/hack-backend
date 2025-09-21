const express = require("express");
const verifyToken = require("../../middlewares/token/verifyToken");
const campaignRouter = express.Router();
const Campaign = require("../../models/Campaigns/campaigns.model");

campaignRouter.post("/create", verifyToken, async (req, res) => {
  const { title, description, goalAmount, category, raisedAmount, status } =
    req.body;

  try {
    const Campaigns = await Campaign.create({
      title,
      description,
      goalAmount,
      category,
      raisedAmount,
      status,
      createdBy: req.user.id,
    });
    res.status(201).json({
      message: "Campaign created successfully",
      Campaigns,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating campaign",
      error: error.message,
    });
    console.log(error);
  }
});

campaignRouter.get("/get", async (req, res) => {
  try {
    const campaign = await Campaign.find({ status: "active" });
    res.send(campaign);
  } catch (error) {
    console.error(error);
  }
});

campaignRouter.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await Campaign.findById(id);
    res.send(campaign);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

campaignRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await Campaign.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.send({ msg: "Update successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error", error });
  }
});

module.exports = campaignRouter;
