// src/app/aansoek/begin/clientAuthPage.tsx
'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { login, signup } from './actions';
import SubmitButton from '../../admin/SubmitButton';

const AuthMessage = ({ message, type }: { message: string, type: 'success' | 'error' }) => {
    const baseClasses = "w-full p-4 rounded-md mb-6 text-center";
    const styles = {
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return (
        <div className={`${baseClasses} ${styles[type]}`}>
            <p>{message}</p>
        </div>
    );
};

type AuthMessageProps = {
    message: string;
    type: 'success' | 'error';
} | null;

export default function ClientAuthPage({ initialMessage }: { initialMessage: AuthMessageProps }) {

    const [message, setMessage] = useState(initialMessage);
    const [isVisible, setIsVisible] = useState(!!initialMessage);

    useEffect(() => {
        setMessage(initialMessage);
        setIsVisible(!!initialMessage);

        if (initialMessage) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                window.history.replaceState(null, '', '/aansoek/begin');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [initialMessage]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-900">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-zinc-800">
                <div className="flex mb-8 justify-center">
                    <Image
                        src="/wapen.png" //
                        alt="Hoërskool Brits Logo"
                        width={150}
                        height={50}
                        priority
                        className="h-auto"
                    />
                </div>
                <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-zinc-300">
                    Welkom by Hoërskool Brits se Aansoekportaal
                </h1>
                <p className="mb-8 text-center text-lg font text-gray-800 dark:text-zinc-300 custom_sort_0.5_p-4">
                    Teken in as jy reeds 'n rekening het.
                </p>

                {isVisible && message && (
                    <AuthMessage message={message.message} type={message.type} />
                )}

                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300"
                        >
                            E-pos:
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 dark:bg-neutral-500 dark:text-zinc-200"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300"
                        >
                            Wagwoord:
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 dark:bg-neutral-500 dark:text-zinc-200"
                        />
                    </div>
                    <div className="text-right text-xs">
                        <a href="">Wagwoord Vergeet?</a>
                    </div>

                    <div className="flex gap-4 md:pt-2">
                        <SubmitButton
                            formAction={login} // <--- BELANGRIK: 'formAction' skuif hierheen
                            defaultText="Teken In"
                            loadingText="Teken in..."
                            className="w-full rounded bg-rose-950 py-2 font-medium text-white transition hover:bg-rose-900"
                        />
                    </div>

                    <hr className="my-8  border-zinc-300 dark:border-zinc-600" />

                    <div className="grid grid-cols-2 items-center gap-4 rounded-sm border border-zinc-300 p-4 dark:border-zinc-600">
                        <p className="text-left md:text-lg text-sm font text-gray-800 dark:text-zinc-300">
                            Nog nie 'n rekening?
                        </p>

                        <div>
                            <SubmitButton
                                formAction={signup} // <--- BELANGRIK: 'formAction' skuif hierheen
                                defaultText="Skep Rekening"
                                loadingText="Besig..."
                                className="w-full rounded bg-yellow-600 py-2 text-sm md:font-medium text-white transition hover:bg-yellow-700"
                            />
                        </div>
                    </div>

                    <p className="mb-0 text-center text-xs font text-gray-800  dark:text-zinc-300">
                        Nick van der Merwe
                    </p>
                    <p className="mb-0 text-center text-xs font text-gray-800  dark:text-zinc-300">
                        Nicolabs Digital © 2025
                    </p>

                </form>
            </div>
        </div>
    );
}