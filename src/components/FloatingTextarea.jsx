import React from "react";

const FloatingTextarea = ({label, name, register, error, maxLength}) => {
  return (
    <div className="relative">
      <textarea
        className={`peer w-full px-3.5 pt-4 pb-2 text-sm border rounded-md bg-transparent
          outline-none transition-all pr-10
          dark:text-white dark:border-gray-600 dark:focus:border-blue-500
          ${
            error
              ? "border-rose-500 focus:border-rose-500"
              : "focus:border-blue-500"
          }`}
        placeholder=""
        {...register(name)}
        id={name}
        maxLength={maxLength}
        data-hs-textarea-auto-height=""
      ></textarea>
      <label
        htmlFor={name}
        className={`absolute left-3 -top-2.5 text-xs px-1 transition-all bg-white dark:bg-gray-800
                peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500 
                ${
                  error
                    ? "text-rose-500 peer-focus:text-rose-500"
                    : "text-gray-500"
                }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingTextarea;
