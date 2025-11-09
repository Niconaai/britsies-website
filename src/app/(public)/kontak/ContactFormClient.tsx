// src/app/(public)/kontak/ContactFormClient.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useActionState } from 'react';
import Image from 'next/image';
// ONS IMPORTEER NIE 'FloatingLabelInputField' MEER NIE
import { sendContactEmail, type ContactFormState } from './actions';

// --- REGSTELLING: Plaaslike definisie van InputField sonder 'dark:' klasse ---
const FloatingLabelInputField = ({ label, name, type = 'text', value, onChange, required, error }: any) => (
  <div className="relative w-full">
    <input
      id={name} name={name} type={type} value={value} onChange={onChange} required={required}
      placeholder=" "
      className={`peer w-full rounded-sm border bg-transparent px-3.5 pt-4 pb-2 text-zinc-900 
                 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none 
                 ${error ? 'border-red-500' : 'border-zinc-300'}`}
    />
    <label
      htmlFor={name}
      className={`absolute left-3.5 top-2.5 flex items-center gap-0.5 rounded-md px-1 text-sm transition-all duration-200
                 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
                 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white
                 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white
                 ${error 
                   ? 'text-red-600' 
                   : 'text-zinc-500 peer-placeholder-shown:text-zinc-400 peer-focus:text-zinc-800 peer-not-placeholder-shown:text-zinc-800'
                 }`}
    >
      <span>{label}</span>
      {required && <span className="text-red-600">*</span>}
    </label>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// --- REGSTELLING: Plaaslike definisie van TextArea sonder 'dark:' klasse ---
const FloatingLabelTextArea = ({ label, name, value, onChange, required, error }: any) => (
  <div className="relative w-full">
    <textarea
      id={name} name={name} value={value} onChange={onChange} required={required}
      rows={5} placeholder=" "
      className={`peer w-full rounded-sm border bg-transparent px-3.5 pt-4 pb-2 text-zinc-900 
                 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none 
                 ${error ? 'border-red-500' : 'border-zinc-300'}`}
    />
    <label
      htmlFor={name}
      className={`absolute left-3.5 top-2.5 flex items-center gap-0.5 rounded-md px-1 text-sm transition-all duration-200
                 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
                 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white
                 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white
                 ${error 
                   ? 'text-red-600' 
                   : 'text-zinc-500 peer-placeholder-shown:text-zinc-400 peer-focus:text-zinc-800 peer-not-placeholder-shown:text-zinc-800'
                 }`}
    >
      <span>{label}</span>
      {required && <span className="text-red-600">*</span>}
    </label>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// Die knoppie wat sy eie status dophou
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-rose-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-rose-800 disabled:opacity-50"
    >
      {pending ? (
        <Image
          src="/CircleLoader.gif"
          alt="Stuur..."
          width={24}
          height={24}
          unoptimized={true}
        />
      ) : (
        "Stuur Boodskap"
      )}
    </button>
  );
}

// Die hoofvorm-komponent
export default function ContactFormClient() {
  const initialState: ContactFormState = { success: false, message: null, errors: null };
  const [state, formAction] = useActionState(sendContactEmail, initialState);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (state.success) {
      setFullName('');
      setEmail('');
      setMessage('');
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-6">
      <FloatingLabelInputField
        label="Volle Naam"
        name="fullName"
        value={fullName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
        required
        error={state.errors?.fullName?.[0]}
      />
      <FloatingLabelInputField
        label="E-posadres"
        name="email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
        error={state.errors?.email?.[0]}
      />
      <FloatingLabelTextArea
        label="Boodskap"
        name="message"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
        required
        error={state.errors?.message?.[0]}
      />
      
      <SubmitButton />

      {state.message && (
        <div className={`mt-4 text-center text-sm font-medium ${
          state.success ? 'text-green-600' : 'text-red-600'
        }`}>
          {state.message}
        </div>
      )}
    </form>
  );
}