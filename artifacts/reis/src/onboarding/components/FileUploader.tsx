import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFileUploaded: (fileDetails: { name: string; size: number; format: "csv" | "xlsx" | "json" | "sql"; content: string }) => void;
}

export default function FileUploader({ onFileUploaded }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(10);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Parse format
          const ext = selectedFile.name.split(".").pop()?.toLowerCase();
          const format = ["csv", "xlsx", "json", "sql"].includes(ext || "") ? (ext as any) : "csv";

          onFileUploaded({
            name: selectedFile.name,
            size: selectedFile.size,
            format,
            content: "Mock parsed CSV content rows preview..."
          });
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`upload-zone border-2 border-dashed border-border/80 rounded-2xl p-8 text-center cursor-pointer hover:bg-muted/30 transition-all flex flex-col items-center justify-center min-h-[160px] ${
          isDragOver ? "border-primary bg-primary/5" : ""
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".csv,.xlsx,.json,.sql"
          className="hidden"
        />

        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <Upload className="h-5.5 w-5.5" />
        </div>
        <p className="text-sm font-bold text-foreground">Drag & Drop files here, or browse</p>
        <p className="text-xs text-muted-foreground mt-1.5">
          Supported formats: CSV, Excel (.xlsx), JSON, SQL Export (Max 50MB)
        </p>
      </div>

      {isUploading && (
        <div className="p-4 border border-border/80 rounded-2xl bg-card space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5 truncate">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              {file?.name}
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
