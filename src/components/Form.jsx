import React, { useState } from 'react';
import Input from './Input';

const UserForm = () => {
  const[data,setData]=useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    about: '',
    image: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const patterns = {
    name: /^[a-zA-Z\s]{2,30}$/,                      
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,             
    phone: /^[0-9]{10}$/,                            
    location: /^[a-zA-Z\s,]{2,50}$/,                 
  };
  

  const validate = () => {
    const newErrors = {};
  
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (!patterns.name.test(formData.name)) {
      newErrors.name = "Enter a valid name (2-30 letters)";
    }
  
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!patterns.email.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
  
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!patterns.phone.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
  
    if (!formData.location) {
      newErrors.location = "Location is required";
    } else if (!patterns.location.test(formData.location)) {
      newErrors.location = "Enter a valid location";
    }
  
    if (!formData.about) {
      newErrors.about = "Tell us something about yourself";
    }
  
    if (!formData.image) {
      newErrors.image = "Profile image is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    
    console.log("Submitted data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} >
      <Input
        name="name"
        label="Name"
        placeholder="Naman Katiyar"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="naman.vayuz@gmail.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Input
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="8115106775"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        pattern="[0-9]{10}"
        maxLength={10}
      />

      <Input
        name="location"
        label="Location"
        placeholder="City, Country"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
      />

      <div>
        <label >About</label>
        <textarea
          name="about"
          placeholder="Tell us about yourself..."
          value={formData.about}
          onChange={handleChange}
          
        ></textarea>
        {errors.about && <span >{errors.about}</span>}
      </div>

      <div>
        <label>Profile Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="mt-1"
        />
        {errors.image && <span >{errors.image}</span>}
      </div>

      <button
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default UserForm;
