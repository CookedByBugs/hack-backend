const express = require("express");
const Donation = require("../../models/Donor/donor.model");
const dashboardRouter = express.Router();
const Campaign = require("../../models/Campaigns/campaigns.model");
const User = require("../../models/Auth/auth.model");

// ---------- /stats API ----------
dashboardRouter.get("/stats", async (req, res) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const activeCampaigns = await Campaign.countDocuments({ status: "Active" });
    const totalDonors = await User.countDocuments({ role: "donor" });
    const ongoingEvents = await Campaign.countDocuments({ status: "Ongoing" });

    res.json({
      totalDonations: totalDonations[0]?.total || 0,
      activeCampaigns,
      totalDonors,
      ongoingEvents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ---------- /recent API ----------
dashboardRouter.get("/recent", async (req, res) => {
  try {
    const recentCampaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status createdAt");

    res.json(recentCampaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

module.exports = dashboardRouter;
