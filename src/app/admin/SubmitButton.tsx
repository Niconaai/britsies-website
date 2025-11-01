// src/app/admin/SubmitButton.tsx
'use client';

import { useFormStatus } from 'react-dom';
import Image from 'next/image';

interface SubmitButtonProps {
  defaultText: string;
  loadingText: string;
  className?: string;
  formAction?: (formData: FormData) => void;
}

export default function SubmitButton({ 
  defaultText, 
  loadingText, 
  className,
  formAction 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const defaultClasses = "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const disabledClasses = "cursor-not-allowed opacity-70";

  return (
    <button
      type="submit"
      disabled={pending}
      // +++ GEE DIE formAction DEUR NA DIE KNOPPIE +++
      formAction={formAction}
      className={`${className || defaultClasses} ${pending ? disabledClasses : ''} flex min-h-[38px] items-center justify-center gap-2`}
    >
      {pending ? (
        <>
          <Image
            src="/CircleLoader.gif"
            alt="Besig..."
            width={20}
            height={20}
            unoptimized={true}
          />
          {loadingText}
        </>
      ) : (
        defaultText
      )}
    </button>
  );
}