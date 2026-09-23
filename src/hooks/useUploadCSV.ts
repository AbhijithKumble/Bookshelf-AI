"use client";

import toast from "react-hot-toast";
import { useState, ChangeEvent } from "react";

export function useUploadCSV() {
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
      } else {
        alert("❌ Please select a valid CSV file.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(message || "Upload failed");
      }

      toast.success("CSV Upload successful!");
      setOpen(false);
      setFile(null);
    } catch (err: unknown) {
      // console.error(err);
      toast.error((err as Error)?.message || "Upload failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    open,
    setOpen,
    file,
    loading,
    handleFileChange,
    handleUpload,
  };
}

