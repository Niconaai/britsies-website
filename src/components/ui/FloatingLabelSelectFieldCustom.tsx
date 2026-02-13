import React from "react";

type OptionType = {
  value: string | number;
  label: string;
};

type FloatingLabelSelectFieldCustomProps = {
  label: string;
  name: string;
  value: string | number | undefined | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: OptionType[]; // <-- Accepts an array of { value, label } objects
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

const FloatingLabelSelectFieldCustom = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = "",
  disabled = false,
}: FloatingLabelSelectFieldCustomProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="peer w-full appearance-none rounded-sm border border-zinc-300 bg-transparent px-3.5 pt-4 pb-2 text-zinc-900 
                   invalid:border-zinc-300 dark:invalid:border-zinc-600
                   focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none
                   dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-white dark:focus:ring-white
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" disabled hidden></option>
        
        {/* Updated mapping logic for { value, label } */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={name}
        className="absolute left-3.5 top-2.5 flex items-center gap-0.5 rounded-md bg-white px-1 text-sm text-zinc-500 transition-all duration-200
                   peer-invalid:top-3.5 peer-invalid:text-zinc-400 peer-invalid:text-base peer-invalid:bg-transparent
                   peer-valid:-top-2 peer-valid:text-xs peer-valid:text-zinc-800 peer-valid:bg-white
                   peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-800 peer-focus:bg-white
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

export default FloatingLabelSelectFieldCustom;