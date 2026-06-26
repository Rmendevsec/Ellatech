import React, { useState } from "react";
import axios from "axios";
function userRegistration() {
  const [formData, setFormData] = useState({

    name: "",
    email: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users",
        formData,
      );
      success("Product created successfully");
      setFormData({
        name: "",
        email: "",
        
      });
    } catch (err) {
      setError(err?.response.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex item-center justify-center">
      <form action="" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb3">{success}</p>}
  
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        />
    
        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg hover:bggray-800"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default userRegistration;
