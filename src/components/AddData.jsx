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
import FloatingInput from "./FloatingInput.jsx";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


const UserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(false);

  const { singleUser, loading } = useSelector((state) => state.users);

  const addUserSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]{2,50}$/, "Name must be 2-50 characters and contain only letters and spaces"),
  
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email"
      ),
  
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^[6-9]\d{9}$/,
        "Phone number must be exactly 10 digits and start with 6, 7, 8, or 9"
      ),
  
    location: yup
      .string()
      .required("Location is required")
      .matches(
        /^[A-Za-z\s,]{2,30}$/,
        "Location must be 2-30 characters long and contain only letters, commas and spaces"
      ),
  
    about: yup
      .string()
      .max(400, "About must be at most 400 characters"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(addUserSchema),

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

  if (isEditMode && loading) {
    return (
      <div className="text-center mt-16">
        <h2>Loading user data...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          {isEditMode ? "Update User" : "Enter Your Details"}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FloatingInput
            label="Name"
            name="name"
            type="text"
            register={register}
            maxLength={50}
            error={errors.name}
          />
          <FloatingInput
            label="Email"
            name="email"
            type="text"
            register={register}
            maxLength={50}
            error={errors.email}
          />
          <FloatingInput
            label="Contact Number"
            name="phone"
            type="text"
            register={register}
            maxLength={10}
            error={errors.phone}
          />
          <FloatingInput
            label="Location"
            name="location"
            type="text"
            register={register}
            maxLength={30}
            error={errors.location}
          />
          <FloatingInput
            label="About"
            name="about"
            type="textarea"
            register={register}
            maxLength={400}
            error={errors.about}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Status
            </label>
          </div>
  
          {/* File Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile && selectedFile.size > 3 * 1024 * 1024) {
                  toast.error("🚫 File size should be less than 3MB");
                  e.target.value = "";
                  setFile(null);
                  return;
                }
                setFile(selectedFile);
              }}
              className="block w-full text-sm text-gray-700 dark:text-white 
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer"
            />
          </div>
  
          {(file || singleUser?.image) && (
            <div className="md:col-span-2 flex gap-4 items-center">
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
              )}
              {!file && singleUser?.image && (
                <img
                  src={singleUser.image}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
              )}
            </div>
          )}
  
          <div className="md:col-span-2 flex justify-between mt-4">
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50"
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
              className="px-6 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition"
            >
              ⬅ Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default UserForm;
