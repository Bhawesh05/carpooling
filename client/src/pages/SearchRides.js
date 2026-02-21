import React, { useState, useEffect } from "react";
import api from "../utils/api";
import RideCard from "../components/rides/RideCard";
import styles from "./SearchRides.module.css";

const SearchRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ from: "", to: "", date: "" });

  const fetchRides = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/rides", { params });
      setRides(data);
      setSearched(true);
    } catch (err) {
      console.error("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRides(filters);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.page}>
      <div className={styles.searchBox}>
        <h2>Find a Ride</h2>
        <form onSubmit={handleSearch} className={styles.form}>
          <input
            type="text"
            name="from"
            value={filters.from}
            onChange={handleChange}
            placeholder="From city"
          />
          <input
            type="text"
            name="to"
            value={filters.to}
            onChange={handleChange}
            placeholder="To city"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className={styles.results}>
        {loading && <p className={styles.msg}>Searching...</p>}

        {!loading && searched && rides.length === 0 && (
          <p className={styles.msg}>No rides found. Try different dates or cities.</p>
        )}

        {!loading && rides.map((ride) => (
          <RideCard key={ride._id} ride={ride} />
        ))}
      </div>
    </div>
  );
};

export default SearchRides;
