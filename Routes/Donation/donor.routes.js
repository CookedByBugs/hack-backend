const express = require("express");
const Donation = require("../../models/Donor/donor.model");
const Campaign = require("../../models/Campaigns/campaigns.model");
const donationRouter = express.Router();

donationRouter.post("/create", async (req, res) => {
  const { donorId, campaignId, amount } = req.body;

  try {
    const donation = new Donation({
      donorId,
      campaignId,
      amount,
    });
    await donation.save();

    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { raisedAmount: amount },
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Donation created successfully",
        donation,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

donationRouter.get("/campaign/:id", async (req, res) => {
  try {
    const donations = await Donation.find({ campaignId: req.params.id })
      .populate("donorId", "name email") // fetch donor details
      .populate("campaignId", "title goalAmount raisedAmount"); // fetch campaign info

    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
donationRouter.get("/donor/:id", async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.params.id }).populate(
      "campaignId",
      "title goalAmount raisedAmount"
    );

    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = donationRouter;
