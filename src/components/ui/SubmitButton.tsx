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
  const { pending, action } = useFormStatus();

  const isPending = pending && action === formAction;

  const defaultClasses = "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const disabledClasses = "cursor-not-allowed opacity-70";

  return (
    <button
      formAction={formAction}
      type="submit"
      aria-disabled={isPending}
      disabled={isPending}
      className={`${className || defaultClasses} ${pending ? disabledClasses : ''} flex min-h-[38px] items-center justify-center gap-2`}
    >
      {isPending ? (
        <>
          <Image
            src="./CircleLoader.gif"
            alt="Besig..."
            width={20}
            height={20}
            unoptimized={true}
          />
          {loadingText}
        </>
      ) : (
        isPending ? loadingText : defaultText
      )}
    </button>
  );
}