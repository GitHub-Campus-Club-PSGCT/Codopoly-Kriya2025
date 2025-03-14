import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/login.module.css'
import { serverAPI } from '../api/API';

const Login = () => {
  const [formData, setFormData] = useState({ teamName: '', password: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await serverAPI.login(formData);
      localStorage.setItem('codopoly_token', response.data.token); // Store token
      setLoading(false);
      navigate('/choosephase');
    } catch (err) {
      console.error(err);
      setLoading(false);
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
          {loading?(
          <div className={styles.loadingspinner}></div>
          ):"Login"}
        </button>
      </form>
      <a style={{"fontSize":"1em", "marginTop":"1em", "marginBottom":"1em","color":"#F96024"}} href="/register">Register your team here</a>
    </div>
  );
};

export default Login;
