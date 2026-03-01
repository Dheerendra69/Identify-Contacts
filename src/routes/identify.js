const express = require("express");
const identifyContact = require("../services/identifyService");
const router = express.Router();

router.post("/identify", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    const response = await identifyContact(email, phoneNumber);
    res.status(200).json(response);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
});

module.exports = router;
