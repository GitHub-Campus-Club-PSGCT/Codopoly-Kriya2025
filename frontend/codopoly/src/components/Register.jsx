import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    teamName: '',
    password: '',
    confirmPassword: '',
    members: [{ kriya_id: '' }, { kriya_id: '' }, { kriya_id: '' }]
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/team/register', formData);
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert('Registration failed!');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Team Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Team Name</label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">Members (1-3)</h3>
        {formData.members.map((member, index) => (
          <div key={index} className="mb-2">
            <label className="block text-gray-700">Kriya ID for Member {index + 1}</label>
            <input
              type="text"
              name={`member${index}`}
              value={member.kriya_id}
              onChange={(e) => handleChange(e, index)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md mt-4">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
