import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../components/FloatingInput";
import { Toaster, toast } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuthStore from "../zustand/authStore";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Minimum 8 characters"),
});
const Login = () => {
  const navigate = useNavigate();
  const { userEmail, userLogin, clearUserEmail } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: userEmail || "",
      password: "",
    },
  });

  const onSubmit = async (formvalue) => {
    try {
      await userLogin(formvalue);
      clearUserEmail;
      navigate("/");
      reset();
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    document.title = "CRUD-Login";
    return () => {
      document.title = "CRUD";
    };
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Login to your account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FloatingInput
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
          />

          <FloatingInput
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.message}
          />
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`w-full py-2 px-4 text-sm font-medium text-white rounded-md disabled:opacity-50 transition ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          {/* Signup Link */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => navigate("/auth")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
