import React from "react";

type FloatingLabelSelectFieldProps = {
  label: string;
  name: string;
  value: string | undefined | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  className?: string;
};

const FloatingLabelSelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = "",
}: FloatingLabelSelectFieldProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="peer w-full appearance-none rounded-sm border border-zinc-300 bg-transparent px-3.5 pt-4 pb-2 text-zinc-900 
                   invalid:border-zinc-300 dark:invalid:border-zinc-600
                   focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none
                   dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
      >
        <option value="" disabled hidden></option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <label
        htmlFor={name}
        className="absolute left-3.5 top-2.5 flex items-center gap-0.5 rounded-md bg-white px-1 text-sm text-zinc-500 transition-all duration-200
                   
                   /* When invalid (empty): Move label INSIDE to match input's placeholder position */
                   peer-invalid:top-3.5 peer-invalid:text-zinc-400 peer-invalid:text-base peer-invalid:bg-transparent
                   
                   /* When valid (filled): Move label UP */
                   peer-valid:-top-2 peer-valid:text-xs peer-valid:text-zinc-800 peer-valid:bg-white
                   
                   /* When focused (either state): Move label UP */
                   peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-800 peer-focus:bg-white
                   
                   /* --- DARK MODE VERSIONS --- */
                   dark:text-zinc-300
                   dark:peer-invalid:text-zinc-400
                   dark:peer-valid:text-white dark:peer-valid:bg-zinc-700
                   dark:peer-focus:text-white dark:peer-focus:bg-zinc-700"
      >
        <span>{label}</span>
        {required && <span className="text-red-600">*</span>}
      </label>

      {/* Dropdown arrow */}
      <svg
        className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-zinc-500 dark:text-zinc-300"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default FloatingLabelSelectField;

