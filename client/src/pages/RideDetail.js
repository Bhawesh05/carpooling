import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import styles from "./RideDetail.module.css";

const RideDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const { data } = await api.get(`/rides/${id}`);
        setRide(data);
      } catch {
        navigate("/rides");
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id, navigate]);

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBooking(true);
    try {
      await api.post(`/rides/${id}/book`);
      setMessage("Ride booked successfully!");
      // refresh ride to show updated seats
      const { data } = await api.get(`/rides/${id}`);
      setRide(data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <p className={styles.msg}>Loading...</p>;
  if (!ride) return null;

  const rideDate = new Date(ride.date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.route}>
          <div>
            <p className={styles.label}>From</p>
            <p className={styles.city}>{ride.from}</p>
          </div>
          <span className={styles.arrow}>→</span>
          <div>
            <p className={styles.label}>To</p>
            <p className={styles.city}>{ride.to}</p>
          </div>
        </div>

        <div className={styles.meta}>
          <div>
            <p className={styles.label}>Date</p>
            <p>{rideDate}</p>
          </div>
          <div>
            <p className={styles.label}>Time</p>
            <p>{ride.time}</p>
          </div>
          <div>
            <p className={styles.label}>Seats Left</p>
            <p>{ride.seatsLeft} / {ride.seats}</p>
          </div>
          <div>
            <p className={styles.label}>Price per Seat</p>
            <p className={styles.price}>₹{ride.pricePerSeat}</p>
          </div>
        </div>

        {ride.notes && (
          <div className={styles.notes}>
            <p className={styles.label}>Driver's Note</p>
            <p>{ride.notes}</p>
          </div>
        )}

        <div className={styles.driver}>
          <p className={styles.label}>Driver</p>
          <p>{ride.driver?.name}</p>
          {ride.driver?.phone && <p className={styles.phone}>{ride.driver.phone}</p>}
        </div>

        {message && (
          <div className={message.includes("success") ? styles.success : styles.error}>
            {message}
          </div>
        )}

        {user?.role === "passenger" && ride.seatsLeft > 0 && (
          <button onClick={handleBook} className={styles.bookBtn} disabled={booking}>
            {booking ? "Booking..." : `Book for ₹${ride.pricePerSeat}`}
          </button>
        )}

        {!user && (
          <button onClick={() => navigate("/login")} className={styles.bookBtn}>
            Login to Book
          </button>
        )}

        {ride.seatsLeft === 0 && (
          <p className={styles.full}>This ride is fully booked</p>
        )}
      </div>
    </div>
  );
};

export default RideDetail;
