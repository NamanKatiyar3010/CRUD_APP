import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSignUp } from "../slices/authSlice";

// Yup Schema
const signUpSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Name is required")
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Only letters and spaces allowed"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^([0-9])(?!\1{9})([0-9]{9})$/, "Enter a valid 10-digit number"),
  password: yup
    .string()
    .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/\d/, 'Password must contain at least one number')
  .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formValue) => {
    try {
      delete formValue.confirmPassword;
      await dispatch(userSignUp(formValue)).unwrap();
      reset();
      navigate("/auth/login");
    } catch (error) {
      console.log(error, "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            {...register("fullName")}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            placeholder="e.g., Naman Katiyar"
          />
          {errors.fullName && (
            <p className="text-sm text-red-600 mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            // maxLength=
            {...register("email")}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            placeholder="e.g., email@mail.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            {...register("phoneNumber")}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            placeholder="e.g., 9876543210"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-600 mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="text-sm text-blue-600 hover:underline text-center"
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
