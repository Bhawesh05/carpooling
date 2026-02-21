import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthForm.module.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "passenger",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        <p className={styles.subtitle}>Join as a driver or passenger</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Phone (optional)</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your phone number"
          />
        </div>

        <div className={styles.field}>
          <label>I want to</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="passenger">Find rides (Passenger)</option>
            <option value="driver">Offer rides (Driver)</option>
          </select>
        </div>

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
