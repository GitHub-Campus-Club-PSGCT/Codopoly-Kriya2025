import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/login.module.css'

const Login = () => {
  const [formData, setFormData] = useState({ teamName: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/team/login', formData);
      localStorage.setItem('codopoly_token', response.data.token);  // Store token
      alert('Login successful!');
      navigate('/choosephase');
    } catch (err) {
      console.error(err);
      alert('Login failed!');
    }
  };

  return (
    <div className={styles.logincontainer}>
      <h2 className={styles.maintext}>Team Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="mb-4">
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            className={styles.inputbox}
            placeholder='Team Name'
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.inputbox}
            placeholder='Password'
          />
        </div>
        <button type="submit" className={styles.loginbutton}>
          Login
        </button>
      </form>
      <a style={{"fontSize":"1em", "marginTop":"1em", "marginBottom":"1em","color":"#F96024"}} href="/register">Register your team here</a>
    </div>
  );
};

export default Login;
