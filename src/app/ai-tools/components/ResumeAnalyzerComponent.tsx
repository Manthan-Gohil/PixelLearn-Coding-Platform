"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import FileUpload from "@/components/AI/FileUpload";
import ResumeReport from "@/components/AI/ResumeReport";
import { uploadAndAnalyzeResume } from "@/lib/api/aiApi";

interface ResumeResult {
  atsScore: number;
  overallFeedback: string;
  skillsGap: string[];
  formattingFeedback: string[];
  missingKeywords: string[];
  improvements: Array<{
    section: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }>;
}

interface ResumeAnalyzerComponentProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ResumeAnalyzerComponent({
  isLoading,
  setIsLoading,
}: ResumeAnalyzerComponentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);

    // Auto-analyze on file select
    await handleResumeAnalysis(file);
  };

  const handleResumeAnalysis = async (fileToAnalyze?: File) => {
    const fileToUse = fileToAnalyze || selectedFile;
    if (!fileToUse) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await uploadAndAnalyzeResume(fileToUse);
      if (result.result && typeof result.result === "object") {
        setResumeResult(result.result as ResumeResult);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume. Please try again."
      );
      setResumeResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Upload Your Resume
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Upload your resume for AI-powered ATS analysis. Get scores for impact, brevity, style, and skills. Receive specific improvement suggestions.
        </p>

        <FileUpload
          onFileSelect={handleFileSelect}
          isLoading={isLoading}
          accept=".pdf,.docx,.txt"
          maxSize={5 * 1024 * 1024}
        />

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-danger/10 border border-danger/20">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {selectedFile && (
          <div className="mt-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-text-secondary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing your resume...</span>
              </div>
            ) : resumeResult ? (
              <p className="text-sm text-success">✓ Resume analyzed successfully</p>
            ) : null}
          </div>
        )}
      </div>

      {/* Results Section */}
      {resumeResult && (
        <ResumeReport result={resumeResult} fileName={selectedFile?.name} />
      )}

      {/* Empty State */}
      {!resumeResult && !isLoading && selectedFile && (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-text-muted">No results yet. Try uploading a different file.</p>
        </div>
      )}
    </div>
  );
}
