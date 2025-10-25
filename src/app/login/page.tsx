// app/admin/login/page.tsx
'use client'

import { login } from './actions' 

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Admin Login
        </h1>
        {/* We use the `login` server action directly in the form's action prop */}
        <form action={login} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
              placeholder="admin@hsbrits.co.za"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-gray-800 py-2 font-medium text-white transition hover:bg-gray-700"
          >
            Sign In
          </button>
          {/* Optional: Add a signup button later if needed */}
          {/* <button formAction={signup}>Sign up</button> */}
        </form>
      </div>
    </div>
  )
}