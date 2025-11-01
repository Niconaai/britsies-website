// components/ui/FloatingLabelInput.tsx
import React from "react";

type FloatingLabelInputProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
};

export default function FloatingLabelInput({
  id,
  name,
  label,
  type = "text",
  required = false,
  children,
}: FloatingLabelInputProps) {
  return (
    <div className="relative w-full">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder=" "
        className="peer w-full rounded-sm border border-zinc-300 bg-transparent px-3.5 pr-10 pt-4 pb-2 text-zinc-900 
                   focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none 
                   dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
      />
      <label
        htmlFor={id}
        className="absolute left-3.5 top-2.5 flex items-center gap-0.5 rounded-md bg-white px-1 text-sm text-zinc-500 transition-all duration-200
                   peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
                   peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-800 peer-focus:bg-white
                   peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-zinc-800 peer-not-placeholder-shown:bg-white
                   dark:text-zinc-300 dark:peer-focus:text-white dark:peer-focus:bg-zinc-700 dark:peer-not-placeholder-shown:text-white dark:peer-not-placeholder-shown:bg-zinc-700"
      >
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      {children && (
        <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 z-20">
          {children}
        </div>
      )}
    </div>
  );
}
