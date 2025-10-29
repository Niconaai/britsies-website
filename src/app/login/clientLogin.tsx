// app/admin/login/clientLogin.tsx
'use client'
import { login } from './actions'
import Image from 'next/image';

export default function ClientPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-neutral-700">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-zinc-800">
        <div className="flex mb-8 justify-center"> {/* Container for margin */}
        <Image
          src="/wapen.png"
          alt="Hoërskool Brits Logo"
          width={150}
          height={50} 
          priority 
          className="h-auto"
        />
      </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800  dark:text-zinc-300">
          Admin Aanteken
        </h1>
        <p className="mb-8 text-center text-lg font text-gray-800 dark:text-zinc-300">
          Webblad bestuur
        </p>
        {/* We use the `login` server action directly in the form's action prop */}
        <form action={login} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700  dark:text-zinc-300"
            >
              Epos:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 dark:bg-neutral-500 dark:text-zinc-200"
              placeholder="admin@hsbrits.co.za"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700  dark:text-zinc-300"
            >
              Wagwoord:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 dark:bg-neutral-500 dark:text-zinc-200"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mb-10 w-full rounded bg-gray-500 py-2 font-medium text-white transition hover:bg-gray-700  "
          >
            Teken In
          </button>
          {/* Optional: Add a signup button later if needed */}
          {/* <button formAction={signup}>Sign up</button> */}

          <p className="mb-0 text-center text-sm font text-gray-800  dark:text-zinc-300">
          Nick van der Merwe
        </p>
        <p className="mb-0 text-center text-sm font text-gray-800  dark:text-zinc-300">
          Nicolabs Digital © 2025
        </p>
        </form>
      </div>
    </div>
  )
}