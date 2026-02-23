"use client";

import { useCallback, useState } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  accept?: string;
  maxSize?: number;
}

export default function FileUpload({
  onFileSelect,
  isLoading,
  accept = ".pdf,.docx,.txt",
  maxSize = 5 * 1024 * 1024, // 5MB
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      const validTypes = [
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload PDF, DOCX, or TXT file.");
        return false;
      }

      // Check file size
      if (file.size > maxSize) {
        setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit.`);
        return false;
      }

      setError(null);
      return true;
    },
    [maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [validateFile, onFileSelect]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-primary/60 bg-primary/5"
            : "border-border hover:border-primary/40"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={isLoading}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-success mb-3" />
            <p className="text-sm font-medium text-text-primary">
              {selectedFile.name}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-xs text-text-muted mt-3">
              Click to change or drag a new file
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-text-muted mb-3" />
            <p className="text-sm font-medium text-text-primary">
              {isDragActive ? "Drop your resume here" : "Upload your resume"}
            </p>
            <p className="text-xs text-text-muted mt-2">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-text-muted mt-2">
              Supported formats: PDF, DOCX, TXT (Max 5MB)
            </p>
          </div>
        )}
      </label>

      {error && (
        <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-danger/10 border border-danger/20">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}
    </div>
  );
}
