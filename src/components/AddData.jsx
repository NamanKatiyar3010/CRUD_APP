import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../slices/userSlice";

const AddData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(false);
  const { loading } = useSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      about: "This is example info",
    },
  });

  const onSubmit = async (formValues) => {
    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) =>
        formData.append(key, value)
      );

      formData.append("status", status);
      if (file) formData.append("image", file);

      const res = await dispatch(addUser(formData)).unwrap();

      toast.success("✅ User added successfully!");
      reset();
      setFile(null);
      setStatus(false);
      navigate("/", { state: { fromAddUser: true } });
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${err.message || "Failed to add user."}`);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          maxWidth: "600px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "#f9f9f9",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 0 10px #ddd",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Enter Your Details</h1>

        {/* Name */}
        <label>
          Name:
          <input
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Min 3 characters" },
              maxLength: { value: 50, message: "Max 50 characters" },
              pattern: {
                value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                message: "Only letters and spaces allowed",
              },
            })}
            placeholder="e.g., Naman Katiyar"
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </label>

        {/* Email */}
        <label>
          Email:
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            placeholder="e.g., email@mail.com"
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </label>

        {/* Phone */}
        <label>
          Phone:
          <input
            type="tel"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^([0-9])(?!\1{9})([0-9]{9})$/,
                message: "Enter a valid 10-digit number",
              },
            })}
            placeholder="e.g., 9876543210"
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone.message}</p>}
        </label>

        {/* Location */}
        <label>
          Location:
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            placeholder="e.g., Delhi"
          />
          {errors.location && <p style={{ color: "red" }}>{errors.location.message}</p>}
        </label>

        {/* About */}
        <label>
          About:
          <textarea
            {...register("about", {
              maxLength: { value: 200, message: "Max 200 characters" },
            })}
            placeholder="Tell us something about yourself"
          />
          {errors.about && <p style={{ color: "red" }}>{errors.about.message}</p>}
        </label>

        {/* Status Checkbox */}
        <label>
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          Active Status
        </label>

        {/* File Upload */}
        <label>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{ maxWidth: "150px", borderRadius: "8px", objectFit: "cover" }}
          />
        )}

        <button
          type="submit"
          disabled={loading || isSubmitting}
          style={{
            padding: "10px 16px",
            background: "#007bff",
            color: "white",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            opacity: loading || isSubmitting ? 0.6 : 1,
          }}
        >
          {loading || isSubmitting ? "Submitting..." : "Submit"}
        </button>

        <Link to="/">
          <button
            type="button"
            style={{
              padding: "10px 16px",
              background: "#6c757d",
              color: "white",
              fontWeight: "bold",
              borderRadius: "6px",
              border: "none",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            ⬅ Back
          </button>
        </Link>
      </form>
    </div>
  );
};

export default AddData;
