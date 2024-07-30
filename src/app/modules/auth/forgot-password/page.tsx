'use client';
import { useTheme } from '@/components/darkmode';
import LoadingSpinner from '@/components/shared/lodingspinner';
import { useForgotPasswordMutation } from '@/Redux/api/authApi';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  useTheme();
  const [email, setEmail] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here

    const res = await forgotPassword({
      email: email,
    }).unwrap();

    if (res && 'validationResponse' in res) {
      setIsError(true);
      setValidationMessage(res?.validationResponse?.message);
    } else {
      setValidationMessage(
        'If this email is registered, a reset link has been sent.',
      );
      toast.success('Please check your email inbox');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 darkmode flex items-center justify-center bg-gradient-to-r ">
      <div className="bg-white light-darkmode p-8 rounded-xl shadow-xl max-w-md w-full">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="absolute">
              <LoadingSpinner size="small" />
            </div>
          </div>
        )}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mt-4 dark:text-gray-50">
            Forgot Password
          </h2>
          <p className="text-gray-600 mt-2 dark:text-gray-50">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        {validationMessage && (
          <div
            className={`p-4 mb-4 border-l-4 ${
              isError
                ? 'bg-red-100 border-red-500 text-red-700'
                : 'bg-green-100 border-green-500 text-green-700'
            }`}
          >
            {validationMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-50"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline light-darkmode"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
