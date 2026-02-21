const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/auth");
const {
  getRides,
  getMyRides,
  createRide,
  getRideById,
  cancelRide,
} = require("../controllers/rideController");
const { bookRide } = require("../controllers/bookingController");

router.get("/", getRides);
router.get("/my", protect, requireRole("driver"), getMyRides);
router.post("/", protect, requireRole("driver"), createRide);
router.get("/:id", getRideById);
router.delete("/:id", protect, requireRole("driver"), cancelRide);
router.post("/:id/book", protect, requireRole("passenger"), bookRide);

module.exports = router;
