const express = require("express");
const Donation = require("../../models/Donor/donor.model");
const Campaign = require("../../models/Campaigns/campaigns.model");
const verifyToken = require("../../middlewares/token/verifyToken");
const donationRouter = express.Router();

donationRouter.post("/create", async (req, res) => {
  const { donorId, campaignId, amount } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // Calculate how much can actually be accepted
    let acceptedAmount = amount;
    const remaining = campaign.goalAmount - campaign.raisedAmount;
    if (amount > remaining) acceptedAmount = remaining;

    // Save donation
    const donation = new Donation({
      donorId,
      campaignId,
      amount: acceptedAmount,
    });
    await donation.save();

    // Update campaign raisedAmount
    campaign.raisedAmount += acceptedAmount;

    // ✅ Automatically close campaign if goal reached
    if (campaign.raisedAmount >= campaign.goalAmount) {
      campaign.status = "closed";
    }

    await campaign.save();

    res.status(201).json({
      success: true,
      donation,
      remaining: campaign.goalAmount - campaign.raisedAmount,
      status: campaign.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});


donationRouter.get("/campaign/:id", async (req, res) => {
  try {
    const donations = await Donation.find({ campaignId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("donorId", "name email") // fetch donor details
      .populate("campaignId", "title goalAmount raisedAmount"); // fetch campaign info

    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
donationRouter.get("/donor/:id", verifyToken, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.params.id })
    .sort({ createdAt: -1 })
    .populate(
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
