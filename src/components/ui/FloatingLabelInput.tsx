// components/ui/FloatingLabelInput.tsx
import React from "react";

type FloatingLabelInputProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
};

export default function FloatingLabelInput({
  id,
  name,
  label,
  type = "text",
  required = false,
}: FloatingLabelInputProps) {
  return (
    <div className="relative w-full">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder=" "
        className="peer w-full rounded-md border border-gray-300 bg-transparent px-3.5 pt-4 pb-2 text-gray-900 
                   focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 
                   dark:bg-neutral-500 dark:text-zinc-200 dark:border-gray-600"
      />
      <label
        htmlFor={id}
        className="absolute left-3.5 top-2.5 flex items-center gap-0.5 rounded-md bg-white px-1 text-sm text-gray-500 transition-all duration-200
                   peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
                   peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-800 peer-focus:bg-white
                   peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-800 peer-not-placeholder-shown:bg-white
                   dark:text-zinc-300 dark:peer-focus:text-zinc-100 dark:peer-focus:bg-neutral-500 dark:peer-not-placeholder-shown:bg-neutral-500"
      >
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}
