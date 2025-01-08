"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { method: "GET" });
        if (!response.ok) {
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      }
    };

    checkSession();
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload PDF.");
      }

      const data = await response.json();

      router.push(`/pdf-chat?fileUrl=${encodeURIComponent(data.fileUrl)}`);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded shadow-md max-w-sm w-full"
      >
        <h1 className="text-xl font-bold mb-4">Upload PDF</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
