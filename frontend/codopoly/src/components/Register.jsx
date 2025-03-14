import React, { useState } from 'react';
import styles from '../styles/register.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Changed API call to axios for better error handling
import { serverAPI } from '../api/API';
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: '',
    password: '',
    confirmPassword: '',
    members: [{ kriya_id: '', name: '' }, { kriya_id: '', name: '' }]  // Updated for 'name' field
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('member')) {
      const updatedMembers = [...formData.members];
      const field = name.includes('kriya_id') ? 'kriya_id' : 'name';
      updatedMembers[index][field] = value;
      setFormData({ ...formData, members: updatedMembers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddMember = () => {
    if (formData.members.length < 4) {
      setFormData({
        ...formData,
        members: [...formData.members, { kriya_id: '', name: '' }]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await serverAPI.register(formData);
      console.log(response.data);
      alert(response.data.message);
      setLoading(false);
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed!');
      setLoading(false);
    }
  };

  return (
    <div className={styles.registercontainer}>
      <h2 className={styles.maintext}>Team Registration</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="teamName"
          value={formData.teamName}
          onChange={handleChange}
          required
          className={styles.inputbox}
          placeholder="Team Name"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.inputbox}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className={styles.inputbox}
          placeholder="Confirm Password"
        />
        <h3 className={styles.text}>Members (2-4)</h3>
        {formData.members.map((member, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              name={`member${index}_kriya_id`}
              value={member.kriya_id}
              onChange={(e) => handleChange(e, index)}
              className={styles.inputbox}
              placeholder={`Kriya ID for Member ${index + 1}`}
              required
            />
            <input
              type="text"
              name={`member${index}_name`}
              value={member.name}
              onChange={(e) => handleChange(e, index)}
              className={styles.inputbox}
              placeholder={`Name for Member ${index + 1}`}
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddMember}
          disabled={formData.members.length >= 4}
          className={formData.members.length === 4 ? `${styles.buttondisableeffect}` : `${styles.registerbutton}`}
        >
          Add Member
        </button>
        <button type="submit" className={styles.registerbutton}>
          {loading ? <div className={styles.loadingspinner}></div> : "Register"}
        </button>
      </form>
      <a style={{ fontSize: "1em", marginTop: "1em", marginBottom: "1em", color: "#F96024" }} href="/login">Already Registered? Login here</a>
    </div>
  );
};

export default Register;
