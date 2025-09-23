"use client";
import { useUploadCSV } from "@/hooks/useUploadCSV";
import { CSVUploadModal } from "./CSVUploadModal";

export default function UploadCSV() {
  const { open, setOpen, loading, handleFileChange, handleUpload } =
    useUploadCSV();

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Upload CSV
      </button>

      {/* Modal */}
      <CSVUploadModal
        open={open}
        setOpen={setOpen}
        loading={loading}
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
      />
    </>
  );
}

