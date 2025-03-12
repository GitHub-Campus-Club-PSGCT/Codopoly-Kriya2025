import React, { useState } from 'react';
import styles from '../styles/register.module.css'
import { useNavigate } from 'react-router-dom';
import { serverAPI } from '../api/API';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: '',
    password: '',
    confirmPassword: '',
    members: [{ kriya_id: '' }, { kriya_id: '' }]  // Start with 2 members
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('member')) {
      const updatedMembers = [...formData.members];
      updatedMembers[index].kriya_id = value;
      setFormData({ ...formData, members: updatedMembers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddMember = () => {
    if (formData.members.length < 4) {
      setFormData({
        ...formData,
        members: [...formData.members, { kriya_id: '' }]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await serverAPI.register(formData);
      console.log(response);
      navigate('/login');
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert('Registration failed! : ',err.message);
    }
  };

  return (
    <div className={styles.registercontainer}>
      <h2 className={styles.maintext}>Team Registration</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="mb-4">
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            className={styles.inputbox}
            placeholder="Team Name"
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
            placeholder="Password"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={styles.inputbox}
            placeholder="Confirm Password"
          />
        </div>
        <h3 className={styles.text}>Members (2-4)</h3>
        {formData.members.map((member, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              name={`member${index}`}
              value={member.kriya_id}
              onChange={(e) => handleChange(e, index)}
              className={styles.inputbox}
              placeholder={`Kriya ID for Member ${index + 1}`}
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddMember}
          disabled={formData.members.length >= 4}
          className={styles.registerbutton}
          style={{ marginBottom: '10px' }}
        >
          Add Member
        </button>
        <button type="submit" className={styles.registerbutton}>
          Register
        </button>
      </form>
      <a style={{"fontSize":"1em", "marginTop":"1em", "marginBottom":"1em","color":"#F96024"}} href="/login">Already Registered? Login here</a>
    </div>
  );
};

export default Register;
