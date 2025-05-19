import React, { useState } from "react";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    name: "",
    gender: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      fetch("https://cribchat-backend-production.up.railway.app/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "success") {
            localStorage.setItem("user", res.token);
            navigate("/");
          } else alert(res.message);
        });

      // Here you can handle form submission, e.g., API call
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.title}>Sign Up</h2>

        <label className={styles.label} htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your phone number"
          required
        />
        {errors.phoneNumber && (
          <p className={styles.error}>{errors.phoneNumber}</p>
        )}

        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your email"
          required
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your name"
          required
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}

        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your password"
          required
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <label className={styles.label}>Gender</label>
        <div className={styles.genderGroup}>
          <label className={styles.genderLabel}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              required
            />
            Male
          </label>
          <label className={styles.genderLabel}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              required
            />
            Female
          </label>
          <label className={styles.genderLabel}>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === "other"}
              onChange={handleChange}
              required
            />
            Other
          </label>
        </div>
        {errors.gender && <p className={styles.error}>{errors.gender}</p>}

        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
