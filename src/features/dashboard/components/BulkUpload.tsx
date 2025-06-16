import React, { useState, useRef } from 'react';
import { Upload, FileText, CircleFadingArrowUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function BulkCaseUploadDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = () => {
    // Template download logic would go here
    console.log('Downloading template...');
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Upload logic would go here
      console.log('Uploading file:', selectedFile);
      setIsOpen(false);
      setSelectedFile(null);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedFile(null);
      setIsDragOver(false);
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
            You can upload multiple cases at once using our standard Excel template. 
            Please download and fill the template accurately before uploading.
          </p>

          {/* Download Template Button */}
          <Button 
            onClick={handleDownloadTemplate}
            className="w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium"
          >
            Download Template
          </Button>

          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Filled Template:
            </label>

            {/* File Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 bg-gray-50'
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
                    <span className="text-sm font-medium text-gray-900">
                      {selectedFile?.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-2 font-medium">
                    Choose files or drag and drop it here.
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    .xlsx, .xls, .csv - Up to 100MB
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
              />

              {!selectedFile && (
                <Button 
                  onClick={handleBrowseClick}
                  variant="outline"
                  className="text-sm font-medium"
                >
                  → Browse File
                </Button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`flex-1 ${
                selectedFile 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : ''
              }`}
            >
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}