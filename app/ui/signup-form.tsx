'use client';

import { lusitana } from '@/app/ui/fonts';
import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormStatus } from 'react-dom';
import { signupStudent } from '../lib/data';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
    // Define the initial state for your form
    const initialState = {
        email: '',
        password: '',
        name: ''
        // other fields as needed
    };


    // Create a state for error messages
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();


    // Create a handler for form submission
    const handleSubmit = async (event) => {
        const formData = new FormData(event.target);
        const response = await signupStudent(formData);

        if (!response.success) {
            setErrorMessage(response.error || "Something went wrong");
        } else {
            window.location.href = 'http://localhost:3000/login';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex-1 rounded-lg bg-blue-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Please provide the details to singup.
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter name"
                                required
                                minLength={1}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                <LoginButton />
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="mt-4 w-full bg-blue-500" aria-disabled={pending} >
            Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50 bg-blue-500" />
        </Button>
    );
}

