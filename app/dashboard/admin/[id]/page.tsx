"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import { Briefcase, Users, LockKeyhole } from "lucide-react"; // Ikon lucide

interface AdminDashboardPageProps {
  params: {
    id: string;
  };
}

export default function AdminDashboardPage({
  params,
}: AdminDashboardPageProps) {
  const { user, loading } = useAuth("admin");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.replace("/auth/login");
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-300 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-emerald-600 to-cyan-700 text-white p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold transition shadow-md"
        >
          Logout
        </button>
      </header>

      <main className="bg-white backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-6xl mx-auto">
        <section>
          <h2 className="text-xl text-black sm:text-2xl font-semibold mb-2">
            Selamat datang, {user?.email}
          </h2>
          <p className="mb-8 text-white/80">
            Kelola data alumni, perusahaan mitra, dan pengaturan admin dari satu
            tempat.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Info Alumni */}
            <div
              onClick={() =>
                handleNavigate(`/dashboard/admin/${user?.uid}/info-alumni`)
              }
              className="group bg-white/20 hover:bg-white/30 text-black rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-md transition transform hover:scale-105"
            >
              <Users className="w-10 h-10 text-blue-800 mb-4 group-hover:animate-pulse" />
              <h3 className="text-lg font-bold mb-1">Info Alumni</h3>
              <p className="text-sm text-black/80">
                Kelola data dan profil alumni.
              </p>
            </div>

            {/* Data Perusahaan */}
            <div
              onClick={() =>
                handleNavigate(`/dashboard/admin/${user?.uid}/data-perusahaan`)
              }
              className="group bg-white/20 hover:bg-white/30 text-black rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-md transition transform hover:scale-105"
            >
              <Briefcase className="w-10 h-10 text-teal-800 mb-4 group-hover:animate-pulse" />
              <h3 className="text-lg font-bold mb-1">Data Perusahaan</h3>
              <p className="text-sm text-black/80">
                Kelola perusahaan mitra & lowongan.
              </p>
            </div>

            {/* Reset Password */}
            <div
              onClick={() =>
                handleNavigate(`/dashboard/admin/${user?.uid}/reset-password`)
              }
              className="group bg-white/20 hover:bg-white/30 text-black rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-md transition transform hover:scale-105"
            >
              <LockKeyhole className="w-10 h-10 text-orange-800 mb-4 group-hover:animate-pulse" />
              <h3 className="text-lg font-bold mb-1">Reset Password</h3>
              <p className="text-sm text-black/80">
                Ubah password akun admin Anda.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
