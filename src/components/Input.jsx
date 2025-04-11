import React from "react";

const Input = ({
  name,
  type = "text",
  placeholder = "",
  maxLength,
  pattern,
  label,
  value,
  onChange,

  error,
}) => {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        pattern={pattern}
        value={value}
        onChange={onChange}
      />

      {error && <span>{error}</span>}
    </div>
  );
};

export default Input;
