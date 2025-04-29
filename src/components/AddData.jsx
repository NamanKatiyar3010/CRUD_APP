import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";
import FloatingInput from "./FloatingInput.jsx";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUserStore } from "./zustand/userStore";
// import addUser from "./zustand/userStore.js"

const UserForm = () => {
  // const dispatch = useDispatch();
  const { addUser, updateUser, fetchSingleUser, clearSingleUser, error } =
    useUserStore();

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(false);

  const { singleUser, loading } = useUserStore();

  const addUserSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Minimum 3 characters")
      .max(50, "Maximum 50 characters")
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Only letters are allowed"),

    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Enter Valid Email"
      ),

    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]\d{9}$/, "Phone number must be exactly 10 digits."),

    location: yup
      .string()
      .required("Location is required")
      .min(3, "Minimum 3 characters")
      .max(50, "Maximum 50 characters")
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Only letters are allowed"),

    about: yup
      .string()
      .max(400, "About must be at most 400 characters")
      .min(3, "Minimum 3 characters"),
    // .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Only letters are allowed"),
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
      fetchSingleUser(id);
    }
  }, [id, isEditMode]);

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
      clearSingleUser();
      reset({
        name: "",
        email: "",
        phone: "",
        location: "",
        about: "",
      });
      setFile(null);
      setStatus(false);
      // document.title="CRUD-Add User";
    }
    // document.title="CRUD-Update User";
  }, [isEditMode, reset]);

  useEffect(() => {
    if (isEditMode) {
      document.title = "CRUD Update User";
    } else {
      document.title = "CRUD Add User";
    }
    return () => {
      document.title = "CRUD";
    };
  }, [isEditMode]);

  const onSubmit = async (formValues) => {
    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("status", status);
      if (file) formData.append("image", file);

      if (isEditMode) {
        await updateUser({ id, formData });
        // toast.success("User updated successfully!");
      } else {
        await addUser(formData);
        // toast.success("User added successfully!");
      }
      reset();
      setFile(null);
      setStatus(false);
      navigate("/");
    } catch (err) {
      console.error("hello", err);
      toast.error(err.message);
    }
  };

  if (isEditMode && loading) {
    return (
      <>
        <div class="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only"></span>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2>Loading user data...</h2>
        </div>
      </>
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
            type="number"
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
                const file = e.target.files[0];
                // Reset first
                if (!file) {
                  setFile(null);
                  return;
                }
                const validTypes = ["image/jpeg", "image/png"];
                const maxSize = 3 * 1024 * 1024;
                // Check type
                if (!validTypes.includes(file.type)) {
                  toast.error("Only JPEG, PNG images are allowed");
                  e.target.value = "";
                  setFile(null);
                  return;
                }
                if (file.size > maxSize) {
                  toast.error("File size must be less than 3MB");
                  e.target.value = "";
                  setFile(null);
                  return;
                }
                setFile(file);
              }}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          <div className="md:col-span-2 flex gap-4 items-center">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg shadow-md"
              />
            ) : singleUser?.image && singleUser.image !== "undefined" ? (
              <img
                src={singleUser.image}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg shadow-md"
              />
            ) : (
              <span className="text-gray-500">No image uploaded</span>
            )}
          </div>

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
