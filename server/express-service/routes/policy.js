const express = require("express");
const router = express.Router();
const { authenticateAdminToken } = require("../middleware/auth");
const Policy = require("../models/Policy"); // Assuming you have a Policy model

// Update Policy Route
router.post("/update-policy", authenticateAdminToken, async (req, res) => {
  const newPolicy = req.body;
  let policy = newPolicy.policy;
  let text = newPolicy.text;

  try {
    // Dynamically update the policy field in MongoDB
    const updatedPolicy = await Policy.updateOne(
      {}, // Empty filter to update the first document in the collection (you can refine this if needed)
      { $set: { [policy]: text } } // Dynamically set the policy field
    );

    if (updatedPolicy.modifiedCount > 0) {
      res.status(200).json({ message: "Successfully updated" });
    } else {
      res.status(404).json({ message: "Policy not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "A server-side error occurred" });
    console.error("Error while updating policy:", error);
  }
});

router.get("/get-policies", async (req, res) => {
  // try {
  //   // Fetch the policy document from MongoDB
  //   const policies = await Policy.findOne({});
  //   // If policies exist, return them
  //   if (policies) {
  //     return res.status(200).json({
  //       privacy: policies.privacy,
  //       use: policies.accUse,
  //       dcma: policies.dcma,
  //     });
  //   } else {
  //     return res.status(404).json({ message: "Policies not found" });
  //   }
  // } catch (error) {
  //   console.error("Error while fetching policies:", error);
  //   return res.status(500).json({
  //     error: "A server-side error occurred while fetching policies.",
  //     details: error.message, // Send the error message for better debugging
  //   });
  // }
});

module.exports = router;
