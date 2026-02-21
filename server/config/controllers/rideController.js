const Ride = require("../models/Ride");
const axios = require("axios");

// GET /api/rides - search rides
const getRides = async (req, res) => {
  const { from, to, date } = req.query;

  try {
    let filter = { status: "active", seatsLeft: { $gt: 0 } };

    if (from) filter.from = { $regex: from, $options: "i" };
    if (to) filter.to = { $regex: to, $options: "i" };
    if (date) {
      const day = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: day, $lt: nextDay };
    }

    const rides = await Ride.find(filter).populate("driver", "name phone email").sort({ date: 1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch rides" });
  }
};

// GET /api/rides/my - get rides posted by logged in driver
const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your rides" });
  }
};

// POST /api/rides - post a new ride
const createRide = async (req, res) => {
  const { from, to, date, time, seats, pricePerSeat, notes } = req.body;

  try {
    const ride = await Ride.create({
      driver: req.user._id,
      from,
      to,
      date,
      time,
      seats,
      pricePerSeat,
      notes,
    });

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: "Could not create ride", error: err.message });
  }
};

// GET /api/rides/:id
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("driver", "name phone email");
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ride" });
  }
};

// DELETE /api/rides/:id - driver can cancel their own ride
const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your ride" });
    }

    ride.status = "cancelled";
    await ride.save();
    res.json({ message: "Ride cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Could not cancel ride" });
  }
};

module.exports = { getRides, getMyRides, createRide, getRideById, cancelRide };
