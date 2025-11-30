"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-4xl font-semibold mb-4">XferLogic</h1>
      <p className="text-lg opacity-70 mb-10 text-center max-w-md">
        Verified community for ETRM, Trading & Risk professionals.
      </p>

      <button
        onClick={() => signIn("linkedin")}
        className="w-full max-w-sm py-3 mb-4 bg-[#0A66C2] rounded-lg font-semibold text-white hover:bg-[#084a8b] transition"
      >
        Sign in with LinkedIn
      </button>

      <button
        onClick={() => signIn("email")}
        className="w-full max-w-sm py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        Sign in with Email
      </button>

      <p className="mt-10 text-xs opacity-40 text-center max-w-sm">
        By signing in, you agree to provide accurate, verifiable experience
        information and understand that community membership is gated by peer validation.
      </p>
    </div>
  );
}
