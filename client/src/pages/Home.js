import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Share rides, save money</h1>
        <p>Connect with drivers heading your way. Post or find rides in seconds.</p>
        <div className={styles.actions}>
          <Link to="/rides" className={styles.primaryBtn}>
            Find a Ride
          </Link>
          {!user && (
            <Link to="/register" className={styles.secondaryBtn}>
              Join as Driver
            </Link>
          )}
          {user?.role === "driver" && (
            <Link to="/post-ride" className={styles.secondaryBtn}>
              Post a Ride
            </Link>
          )}
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.icon}>🚗</div>
          <h3>Post Your Ride</h3>
          <p>Heading somewhere? Post your route and split fuel costs with passengers.</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.icon}>🔍</div>
          <h3>Find a Seat</h3>
          <p>Search by city and date to find drivers going your way.</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.icon}>🤖</div>
          <h3>Smart Fare Estimate</h3>
          <p>Our AI suggests a fair price based on distance so no one overpays.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
