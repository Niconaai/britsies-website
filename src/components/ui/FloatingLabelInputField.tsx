import React, { useState, useEffect } from "react";

type FloatingLabelInputFieldProps = {
  label: string;
  name: string;
  value: string | number | undefined | null;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean; 
  step?: string | number;
};

const FloatingLabelInputField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
  className = "",
  children, 
  disabled = false, 
  step,
  ...props
}: FloatingLabelInputFieldProps) => {
  
  const [effectiveType, setEffectiveType] = useState(type);

  useEffect(() => {
    if (type === "date" && !value) {
      setEffectiveType("text");
    }
  }, [type, value]); 

  const handleFocus = () => {
    if (type === "date") {
      setEffectiveType("date");
    }
  };

  const handleBlur = () => {

    if (type === "date" && !value) {
      setEffectiveType("text");
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={name}
        name={name}
        type={effectiveType}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        placeholder=" " 
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        step={step}
        className="peer w-full rounded-sm border border-zinc-300 bg-transparent px-3.5 pt-4 pb-2 text-zinc-900 
                   focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none 
                   dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
      />
      <label
        htmlFor={name}
        className="absolute left-3.5 top-2.5 flex items-center gap-0.5 rounded-md bg-white px-1 text-sm text-zinc-500 transition-all duration-200
                   peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
                   peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-800 peer-focus:bg-white
                   peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-zinc-800 peer-not-placeholder-shown:bg-white
                   dark:text-zinc-300 dark:peer-focus:text-white dark:peer-focus:bg-zinc-700 dark:peer-not-placeholder-shown:text-white dark:peer-not-placeholder-shown:bg-zinc-700"
      >
        <span>{label}</span>
        {required && <span className="text-red-600">*</span>}
      </label>
    </div>
  );
};

export default FloatingLabelInputField;