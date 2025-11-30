"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-4xl font-semibold mb-4">XferLogic</h1>
      <p className="text-lg opacity-70 mb-10 text-center max-w-md">
        Verified community for ETRM, Trading & Risk professionals.
      </p>

      {/* TEMPORARY BUTTONS – NOT USING signIn() YET */}
      <button
        className="w-full max-w-sm py-3 bg-[#0A66C2] rounded-lg font-semibold text-white hover:bg-[#084a8b] transition"
      >
        LinkedIn Login Coming Soon
      </button>

      <button
        className="w-full max-w-sm py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition mt-4"
      >
        Email Login Coming Soon
      </button>
    </div>
  );
}
