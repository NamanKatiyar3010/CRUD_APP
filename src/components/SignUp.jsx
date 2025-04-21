import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSignUp } from "../slices/authSlice";
import { FcGoogle } from "react-icons/fc";
import FloatingInput from "./FloatingInput";

// Yup validation schema
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
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/\d/, "Must contain a number")
    .matches(/[@$!%*?&#]/, "Must contain a special character"),
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
      console.log("Signup failed", error);

      // If error is coming from rejectWithValue, it will be the full object
      const message = error?.message || "Signup failed";
      const apiError = error?.error;

      toast.error(message, { id: "api-message" });

      if (apiError) {
        toast.error(apiError, { id: "api-error" });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Create an Account
        </h2>
        <FloatingInput
          label="Full Name"
          name="fullName"
          register={register}
          maxLength={50}
          error={errors.fullName}
        />

        <FloatingInput
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
        />

        <FloatingInput
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          register={register}
          error={errors.phoneNumber}
        />

        <FloatingInput
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
        />

        <FloatingInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>

        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <hr className="border w-full" />
          or
          <hr className="border w-full" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium text-gray-700 dark:text-white">
            Sign Up with Google
          </span>
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-2">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/auth/login")}
            className="text-blue-600 hover:underline cursor-pointer"
            type="button"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
