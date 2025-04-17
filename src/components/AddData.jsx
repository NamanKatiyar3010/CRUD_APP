import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  updateUser,
  fetchSingleUser,
  clearSingleUser,
} from "../slices/userSlice";
import { useNavigate, useParams } from "react-router-dom";

const UserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(false);
  console.log(id);

  const { singleUser, loading } = useSelector((state) => state.users);

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
      about: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchSingleUser(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && singleUser) {
      reset({
        name: singleUser.name,
        email: singleUser.email,
        phone: singleUser.phone,
        location: singleUser.location,
        about: singleUser.about,
        image: singleUser.image,
      });
      console.log(singleUser);
      
      setStatus(singleUser.status);
    }
  }, [singleUser, reset, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      dispatch(clearSingleUser());
      reset({
        name: "",
        email: "",
        phone: "",
        location: "",
        about: "",
      });
      setFile(null);
      setStatus(false);
    }
  }, [isEditMode, dispatch, reset]);

  const onSubmit = async (formValues) => {
    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("status", status);
      if (file) formData.append("image", file);

      if (isEditMode) {
        await dispatch(updateUser({ id, formData }));

        toast.success("✅ User updated successfully!");
      } else {
        await dispatch(addUser(formData)).unwrap();
        toast.success("✅ User added successfully!");
      }

      reset();
      setFile(null);
      setStatus(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Operation failed");
    }
  };
  // console.log(singleUser, "cvncvn");
  if (isEditMode && loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>Loading user data...</h2>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mb-6 md:grid-cols-2 justify-center items-center">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 style={{ textAlign: "center" }}>
          {isEditMode ? "Update User" : "Enter Your Details"}
        </h1>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name:
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email:
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </label>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Phone:
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </label>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Location:
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              {...register("location", { required: "Location is required" })}
              placeholder="e.g., Delhi"
            />
            {errors.location && (
              <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
            )}
          </label>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            About:
            <textarea
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("about", {
                maxLength: { value: 200, message: "Max 200 characters" },
              })}
              placeholder="Tell us something about yourself"
            />
            {errors.about && (
              <p className="text-sm text-red-600 mt-1">{errors.about.message}</p>
            )}
          </label>
        </div>
        <div>
          <label>
            <input
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              
            />
            Active Status
          </label>
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Upload Image:
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          accept="image/*"
          
          onChange={(e) => setFile(e.target.files[0])}
        />
          
          {singleUser &&   <img
          src={singleUser?.image}
          alt="Preview"
          style={{
            maxWidth: "150px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />}
        {file && (
          <img
          
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{
              maxWidth: "150px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
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
          {loading || isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Submitting..."
            : isEditMode
            ? "Update"
            : "Submit"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
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
      </form>
    </div>
  );
};

export default UserForm;
