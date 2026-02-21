import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import styles from "./PostRide.module.css";

const PostRide = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 1,
    pricePerSeat: "",
    notes: "",
  });
  const [fareHint, setFareHint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ask the AI service for a suggested fare when from/to are filled
  const getFareSuggestion = async () => {
    if (!form.from || !form.to) return;
    try {
      const res = await fetch(
        `http://localhost:8000/estimate-fare?from=${form.from}&to=${form.to}&seats=${form.seats}`
      );
      const data = await res.json();
      setFareHint(data);
    } catch {
      // AI service might not be running, that's fine
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/rides", form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Post a Ride</h2>
        <p className={styles.subtitle}>Fill in your ride details below</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.row}>
          <div className={styles.field}>
            <label>From</label>
            <input
              name="from"
              value={form.from}
              onChange={handleChange}
              onBlur={getFareSuggestion}
              placeholder="Starting city"
              required
            />
          </div>
          <div className={styles.field}>
            <label>To</label>
            <input
              name="to"
              value={form.to}
              onChange={handleChange}
              onBlur={getFareSuggestion}
              placeholder="Destination city"
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Available Seats</label>
            <input
              type="number"
              name="seats"
              value={form.seats}
              onChange={handleChange}
              min="1"
              max="6"
              required
            />
          </div>
          <div className={styles.field}>
            <label>
              Price per Seat (₹)
              {fareHint && (
                <span
                  className={styles.hint}
                  onClick={() => setForm({ ...form, pricePerSeat: fareHint.suggestedFare })}
                >
                  AI suggests ₹{fareHint.suggestedFare} — use this
                </span>
              )}
            </label>
            <input
              type="number"
              name="pricePerSeat"
              value={form.pricePerSeat}
              onChange={handleChange}
              placeholder="Enter amount"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="E.g. No smoking, luggage space available..."
            rows={3}
          />
        </div>

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? "Posting..." : "Post Ride"}
        </button>
      </form>
    </div>
  );
};

export default PostRide;
