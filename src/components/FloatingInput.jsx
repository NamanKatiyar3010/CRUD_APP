import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FloatingInput = ({
  label,
  name,
  type,
  register,
  error,
  max,
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative mt-4">
      <input
        type={isPassword && showPassword ? "text" : type}
        placeholder=" "
        maxLength={maxLength}
        inputMode={type === "number" ? "numeric" : undefined}
        pattern={type === "number" ? "\\d*" : undefined}
        onInput={(e) => {
          if (type === "number") {
            console.log(e.target.value);
            
            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
          }
        }}
        max={max}
        {...register(name)}
        id={name}
        className={`peer w-full px-3.5 pt-4 pb-2 text-sm border rounded-md bg-transparent
          outline-none transition-all pr-10
          dark:text-white dark:border-gray-600 dark:focus:border-blue-500
          ${
            error
              ? "border-rose-500 focus:border-rose-500"
              : "focus:border-blue-500"
          }`}
      />

      <label
        htmlFor={name}
        className={`absolute left-3 -top-2.5 text-xs px-1 transition-all bg-white dark:bg-gray-800
          peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500 
          ${
            error ? "text-rose-500 peer-focus:text-rose-500" : "text-gray-500"
          }`}
      >
        {label}
      </label>

      {isPassword && (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3.5 cursor-pointer text-gray-500 dark:text-gray-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      )}

      {error && <p className="text-xs text-rose-600 mt-1">{error.message}</p>}
    </div>
  );
};

export default FloatingInput;
