const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/auth");
const { getMyBookings, cancelBooking } = require("../controllers/bookingController");

router.get("/me", protect, requireRole("passenger"), getMyBookings);
router.delete("/:id", protect, requireRole("passenger"), cancelBooking);

module.exports = router;
