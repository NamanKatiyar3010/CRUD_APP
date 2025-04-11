import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddData = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(false);

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

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      formData.append("status", status);
      formData.append("image", file);

      const response = await fetch("https://crud-vip.vercel.app/api/users", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to add user");

      toast.success("✅ User added successfully!");
      reset(); // reset form only
      setFile(null);
      setStatus(false);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add user.");
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
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 600 }}>
          Name:
          <input
            {...register("name", {
              required: "Name is required",
              pattern: {
                value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                message: "Only letters and spaces allowed",
              },
              minLength: { value: 3, message: "Min 3 characters" },
              maxLength: { value: 50, message: "Max 50 characters" },
            })}
            placeholder="e.g., John Doe"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: "0.85rem" }}>{errors.name.message}</p>
          )}
        </label>

        {/* Email */}
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 600 }}>
          Email:
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter valid email",
              },
            })}
            placeholder="e.g., email@mail.com"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "0.85rem" }}>{errors.email.message}</p>
          )}
        </label>

        {/* Phone */}
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 600 }}>
          Phone:
          <input
            type="tel"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^([0-9])(?!\1{9})([0-9]{9})$/,
                message: "Enter 10-digit number",
              },
            })}
            placeholder="e.g., 9876543210"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          {errors.phone && (
            <p style={{ color: "red", fontSize: "0.85rem" }}>{errors.phone.message}</p>
          )}
        </label>

        {/* Location */}
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 600 }}>
          Location:
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            placeholder="e.g., Delhi"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          {errors.location && (
            <p style={{ color: "red", fontSize: "0.85rem" }}>{errors.location.message}</p>
          )}
        </label>

        {/* About */}
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 600 }}>
          About:
          <textarea
            {...register("about", {
              maxLength: { value: 200, message: "Max 200 characters" },
            })}
            placeholder="Tell us something about yourself"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
          {errors.about && (
            <p style={{ color: "red", fontSize: "0.85rem" }}>{errors.about.message}</p>
          )}
        </label>

        {/* Status Checkbox */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            gap: "10px",
          }}
        >
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          Active Status
        </label>

        {/* File Upload */}
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 600 }}>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Image Preview */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{
              maxWidth: "150px",
              height: "auto",
              marginTop: "10px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "#007bff",
            color: "white",
            fontWeight: "bold",
            borderRadius: "6px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        <Link to="/" style={{ textDecoration: "none" }}>
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
