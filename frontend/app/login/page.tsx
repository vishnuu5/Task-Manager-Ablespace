"use client";

import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Check, Users, BarChart2 } from "lucide-react";

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-linear-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-0">
      <div className="hidden md:flex flex-col justify-center items-center w-full md:w-5/12 lg:w-1/3 xl:w-2/5 bg-linear-to-br from-blue-600 to-indigo-700 p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20 text-white">
        <div className="max-w-sm xl:max-w-md w-full space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              Welcome Back!
            </h1>
            <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
              Sign in to access your tasks, collaborate with your team, and
              boost your productivity.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/90 p-2 rounded-full shrink-0 mt-0.5">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-base">
                Manage tasks effortlessly
              </span>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/90 p-2 rounded-full shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-base">
                Collaborate with your team in real-time
              </span>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/90 p-2 rounded-full shrink-0 mt-0.5">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-base">
                Track progress and stay organized
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-7/12 lg:w-2/3 xl:w-3/5 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20">
        <div className="w-full max-w-md mx-auto my-4 sm:my-6 md:my-8">
          <div className="text-center mb-8 md:mb-10 space-y-3 sm:space-y-4">
            <Link href="/" className="inline-block mb-4 md:mb-6">
              <span className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskManager
              </span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Sign in to your account to continue
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-100 space-y-6">
            <div className="space-y-4">
              <LoginForm />
            </div>

            <div className="pt-4 border-t border-gray-100 text-center">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
              <span className="text-gray-500">Don't have an account? </span>
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 px-4">
            <p>
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
