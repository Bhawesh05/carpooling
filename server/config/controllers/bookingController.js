const Booking = require("../models/Booking");
const Ride = require("../models/Ride");

// POST /api/rides/:id/book
const bookRide = async (req, res) => {
  const { seatsBooked = 1 } = req.body;

  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.status !== "active") {
      return res.status(400).json({ message: "This ride is no longer available" });
    }

    if (ride.seatsLeft < seatsBooked) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // make sure driver isn't booking their own ride
    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't book your own ride" });
    }

    // check if already booked
    const alreadyBooked = await Booking.findOne({
      ride: ride._id,
      passenger: req.user._id,
      status: "confirmed",
    });
    if (alreadyBooked) {
      return res.status(400).json({ message: "You already booked this ride" });
    }

    const totalPrice = ride.pricePerSeat * seatsBooked;

    const booking = await Booking.create({
      ride: ride._id,
      passenger: req.user._id,
      seatsBooked,
      totalPrice,
    });

    // update available seats
    ride.seatsLeft -= seatsBooked;
    await ride.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};

// GET /api/bookings/me - passenger's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.user._id })
      .populate({
        path: "ride",
        populate: { path: "driver", select: "name phone" },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bookings" });
  }
};

// DELETE /api/bookings/:id - cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.passenger.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your booking" });
    }

    // give back the seats
    const ride = await Ride.findById(booking.ride);
    if (ride) {
      ride.seatsLeft += booking.seatsBooked;
      await ride.save();
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Could not cancel booking" });
  }
};

module.exports = { bookRide, getMyBookings, cancelBooking };
