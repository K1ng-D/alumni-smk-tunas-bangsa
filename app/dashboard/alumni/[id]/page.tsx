"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { uploadToCloudinary } from "../../../api/upload";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface AlumniDashboardPageProps {
  params: {
    id: string;
  };
}

export default function AlumniDashboardPage({
  params,
}: AlumniDashboardPageProps) {
  const { user, loading } = useAuth("alumni");
  const router = useRouter();

  const [alumniData, setAlumniData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    jurusan: "",
    tahunLulus: "",
    pekerjaan: "",
    alamat: "",
    skills: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }

    const fetchAlumniData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const data = docSnap.data();
        if (
          !data.name ||
          !data.jurusan ||
          !data.tahunLulus ||
          !data.pekerjaan ||
          !data.alamat ||
          !data.skills ||
          !data.imageUrl
        ) {
          // You can alert or warn user here instead of redirecting
          console.warn("Lengkapi semua data profil terlebih dahulu.");
        }

        setAlumniData(data);
        setFormData({
          name: data.name || "",
          jurusan: data.jurusan || "",
          tahunLulus: data.tahunLulus || "",
          pekerjaan: data.pekerjaan || "",
          alamat: data.alamat || "",
          skills: data.skills || "",
          imageUrl: data.imageUrl || "",
        });
      }
    };

    fetchAlumniData();
  }, [loading, user, router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.replace("/auth/login");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!user) return;

    try {
      let imageUrl = alumniData?.imageUrl || "";

      if (image) {
        const uploadedImageUrl = await uploadToCloudinary(image);
        if (!uploadedImageUrl) throw new Error("Gagal mengunggah gambar.");
        imageUrl = uploadedImageUrl;
      }

      const docRef = doc(db, "users", user.uid);
      const updatedData = { ...formData, imageUrl };
      await updateDoc(docRef, updatedData);
      setAlumniData(updatedData);
      setEditMode(false);
      setImage(null);
    } catch (error) {
      console.error("Gagal update:", error);
    }
  };

  if (loading || !alumniData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  function handleNavigate(path: string): void {
    router.push(path);
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-black p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Dashboard Alumni</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition rounded-lg px-5 py-2 font-semibold"
        >
          Logout
        </button>
      </header>

      <main className="bg-white bg-opacity-20 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Selamat datang, {alumniData.name}
        </h2>
        <p className="mb-6 text-black/80">Data profil kamu:</p>

        {!editMode ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white bg-opacity-30 rounded-xl p-6">
              <div className="col-span-2 text-center">
                <img
                  src={alumniData.imageUrl}
                  alt="Foto Profil"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white"
                />
              </div>
              <div>
                <h3 className="font-bold">Email:</h3>
                <p>{user?.email}</p>
              </div>
              <div>
                <h3 className="font-bold">Nama Lengkap:</h3>
                <p>{alumniData.name}</p>
              </div>
              <div>
                <h3 className="font-bold">Jurusan:</h3>
                <p>{alumniData.jurusan}</p>
              </div>
              <div>
                <h3 className="font-bold">Tahun Lulus:</h3>
                <p>{alumniData.tahunLulus}</p>
              </div>
              <div>
                <h3 className="font-bold">Pekerjaan:</h3>
                <p>{alumniData.pekerjaan}</p>
              </div>
              <div>
                <h3 className="font-bold">Alamat:</h3>
                <p>{alumniData.alamat}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-bold">Keahlian / Skill:</h3>
                <p>{alumniData.skills}</p>
              </div>
            </section>

            <div className="mt-6 text-center">
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-400 hover:bg-yellow-500 transition px-6 py-2 rounded-lg font-semibold"
              >
                Edit Profil
              </button>
            </div>
            <h1 className="text-center text-red-500 mt-4">
              * Jika data belum lengkap, masukan data diri terlebih dahulu
              dengan klik tombol edit profil.{" "}
            </h1>
          </>
        ) : (
          <>
            <section className="bg-white bg-opacity-30 rounded-xl p-6 space-y-4">
              {Object.entries(formData).map(
                ([key, value]) =>
                  key !== "skills" &&
                  key !== "imageUrl" && (
                    <div key={key}>
                      <label className="block font-semibold capitalize">
                        {key}
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-white/80 mt-1"
                      />
                    </div>
                  )
              )}
              <div>
                <label className="block font-semibold">Keahlian / Skill</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/80 mt-1"
                />
              </div>
              <div>
                <label className="block font-semibold">Foto Profil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="mt-1 w-full"
                />
              </div>
            </section>

            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-lg text-white"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-bold"
              >
                Simpan
              </button>
            </div>
          </>
        )}
      </main>
      <div
        onClick={() =>
          router.push(`/dashboard/alumni/${user?.uid}/rekomendasi`)
        }
        className="bg-white max-w-4xl mx-auto bg-opacity-30 my-12 rounded-lg p-5 text-center cursor-pointer hover:bg-opacity-50 transition"
      >
        <h3 className="text-lg font-bold mb-2 text-black">
          Klik Untuk ke Halaman Rekomendasi Pekerjaan Untuk Alumni
        </h3>
      </div>
    </div>
  );
}
