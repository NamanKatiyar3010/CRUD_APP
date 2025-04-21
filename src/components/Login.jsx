import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { userLogin } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import FloatingInput from "./FloatingInput";
import { Toaster, toast } from "react-hot-toast";

// import { GoogleReCaptchaProvider, GoogleReCaptcha } from "react-google-recaptcha-v3";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [token, setToken] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formvalue) => {
    try {
      const res = await dispatch(userLogin({ formvalue })).unwrap();
      navigate("/");
      reset();
    } catch (error) {
      setRefreshReCaptcha(!refreshReCaptcha);
      console.error("Login failed:", error);
      // alert("Login failed. Please check your credentials.");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const setTokenFunc = (getToken) => {
    setToken(getToken);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
       <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Login to your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}

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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-sm font-medium text-white rounded-md transition ${
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

        {/* ReCaptcha Placeholder */}
        {/* <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY}>
          <GoogleReCaptcha
            onVerify={setTokenFunc}
            refreshReCaptcha={refreshReCaptcha}
          />
        </GoogleReCaptchaProvider> */}
      </div>
    </div>
  );
};

export default Login;
