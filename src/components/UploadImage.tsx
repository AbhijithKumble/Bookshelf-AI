"use client";
import { useUploadImage } from "@/hooks/useUploadImage";
import { UploadModal } from "./UploadModal";

export default function UploadImage() {
  const { open, setOpen, loading, handleFileChange, handleUpload } =
    useUploadImage();

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Upload Photo
      </button>

      {/* Modal */}
      <UploadModal
        open={open}
        setOpen={setOpen}
        loading={loading}
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
      />
    </>
  );
}

