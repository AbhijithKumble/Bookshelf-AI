"use client";

import toast from "react-hot-toast";
import { useState, ChangeEvent } from "react";

export function useUploadImage() {
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      // console.log(res)

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(message || "Upload failed");
      }

      toast.success("Upload successful!");
      setOpen(false);
      setFile(null);
    } catch (err: any) {
      // console.error(err);
      toast.error(err?.message || "Upload failed, please try again.");
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

