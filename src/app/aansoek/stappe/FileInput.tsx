// src/app/aansoek/stappe/FileInput.tsx
'use client';
import React, { useState } from 'react';

type FileInputProps = {
    label: string;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    description?: string;
    accept?: string; 
};

export default function FileInput({ label, name, onChange, required = false, description, accept }: FileInputProps) {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0 && event.target.files[0].size < 1000000) { //ons toets vir die max filesize ook, wat op 10mb gestel is
            setFileName(event.target.files[0].name);
        } else {
            setFileName(null);
        }
        onChange(event); // Pass the event up to the parent
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className="mt-2">
                <input
                    type="file"
                    id={name}
                    name={name}
                    onChange={handleChange}
                    required={required}
                    accept={accept}
                    className="block w-full text-sm text-zinc-500 dark:text-zinc-400
                        file:mr-4 file:rounded-sm file:border-0
                        file:bg-blue-50 file:py-2 file:px-4
                        file:text-sm file:font-semibold
                        file:text-blue-700 hover:file:bg-blue-100
                        dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
                />
            </div>
            {fileName && <p className="mt-1 text-xs text-green-600 dark:text-green-400">Lêer gekies: {fileName}</p>}
            {description && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
        </div>
    );
}