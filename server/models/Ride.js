const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    seatsLeft: {
      type: Number,
    },
    pricePerSeat: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

// set seatsLeft = seats when creating
rideSchema.pre("save", function (next) {
  if (this.isNew) {
    this.seatsLeft = this.seats;
  }
  next();
});

module.exports = mongoose.model("Ride", rideSchema);
