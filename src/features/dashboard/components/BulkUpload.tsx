"use client";

import React, { useRef, useState, useTransition } from 'react';
import { toast } from "sonner";
import { Upload, FileText, CircleFadingArrowUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BULK_COLUMN_COUNT, bulkTemplateCsv } from '@/features/cases/bulk-template';
import { postBulkCases, type BulkRowError } from '@/features/cases/server/lifecycle';

/**
 * Files a CSV of cases in one go.
 *
 * The dialog used to say "Bulk upload is not available yet" and post nothing,
 * while `POST /casefile/create-bulk-case` had been working all along
 * (QA 2026-11-01, item 11). The API reads the file by column position, so the
 * template is generated from the same contract the upload is checked against.
 */
export default function BulkCaseUploadDialog({ onUploaded }: { onUploaded?: () => void } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rowErrors, setRowErrors] = useState<BulkRowError[]>([]);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const chooseFile = (file?: File) => {
    if (!file) return;
    setRowErrors([]);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    chooseFile(e.dataTransfer.files?.[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => chooseFile(e.target.files?.[0]);

  const handleBrowseClick = () => fileInputRef.current?.click();

  // Built in the browser from the column contract, so the template can never
  // drift from the order the API reads.
  const handleDownloadTemplate = () => {
    const blob = new Blob([bulkTemplateCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lacon-bulk-cases-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    if (!selectedFile || pending) return;
    const payload = new FormData();
    payload.append("file", selectedFile);
    startTransition(async () => {
      const result = await postBulkCases(payload);
      if (!result.success) {
        setRowErrors([]);
        toast.error("The file could not be uploaded", { description: result.message });
        return;
      }
      const { created, errors } = result.data;
      setRowErrors(errors);
      if (created > 0) {
        onUploaded?.();
        toast.success(`${created} case${created === 1 ? "" : "s"} filed`, {
          description: errors.length
            ? `${errors.length} row${errors.length === 1 ? " was" : "s were"} not filed; the details are in the dialog.`
            : "They are in your filed cases now.",
        });
      } else {
        toast.error("Nothing was filed", {
          description: errors.length ? "Every row was refused; the details are in the dialog." : "The file had no rows to read.",
        });
      }
      // Rows that failed stay on screen to be corrected; a clean run closes.
      if (created > 0 && errors.length === 0) {
        setIsOpen(false);
        setSelectedFile(null);
      }
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (pending) return;
    setIsOpen(open);
    if (!open) {
      setSelectedFile(null);
      setIsDragOver(false);
      setRowErrors([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-gray-700 text-white px-4 py-2 flex items-center gap-2 transition-colors h-11">
          <CircleFadingArrowUp size={20} />
          Bulk Upload
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Bulk Case Upload</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-600 text-sm">
            Upload several cases at once. Download the template, fill one case per row and
            upload it. Every row is checked on its own, so the rows that are right are filed
            even if others are not.
          </p>

          <Button
            onClick={handleDownloadTemplate}
            className="w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium"
          >
            Download Template
          </Button>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Filled Template:
            </label>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />

              {selectedFile ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="text-green-500 mr-2" size={20} />
                    <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-2 font-medium">Choose a file or drag and drop it here.</p>
                  <p className="text-xs text-gray-500 mb-4">
                    CSV saved from the template, {BULK_COLUMN_COUNT} columns, up to 10MB
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,text/csv"
                onChange={handleFileSelect}
              />

              {!selectedFile && (
                <Button onClick={handleBrowseClick} variant="outline" className="text-sm font-medium">
                  → Browse File
                </Button>
              )}
            </div>
          </div>

          {rowErrors.length > 0 && (
            <div role="alert" className="max-h-48 space-y-2 overflow-y-auto rounded border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">
                {rowErrors.length} row{rowErrors.length === 1 ? "" : "s"} could not be filed. Correct
                {rowErrors.length === 1 ? " it" : " them"} and upload again.
              </p>
              <ul className="space-y-1 text-xs text-red-700">
                {rowErrors.map((rowError, index) => (
                  <li key={`${rowError.row}-${index}`}>
                    <span className="font-medium">Row {rowError.row}:</span> {rowError.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={() => handleOpenChange(false)} variant="outline" className="flex-1" disabled={pending}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || pending}
              className={`flex-1 ${selectedFile && !pending ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              {pending ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
