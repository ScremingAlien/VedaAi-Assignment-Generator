'use client';

import { RotateCcw, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
  onUpload: (file: File) => void;
  onSuccess: (response: any) => void;
  onFail: () => void;
  id: string;
}

export function FileUploadBox({ onUpload, id, onFail, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const xhrRef = useRef<XMLHttpRequest | null>(null);

  function startUpload(file: File) {
    setFile(file);
    setProgress(0);
    setUploading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open('POST', `${process.env.NEXT_PUBLIC_BACKEND_URL}/assignment/${id}/upload-pdf`, true);

    // progress tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.success === false) {
          onFail();
          return;
        } else {
          onSuccess(response);
        }

        onUpload(file);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
    };

    xhr.send(formData);
  }

  function handleFile(file: File | null) {
    if (!file) return;
    startUpload(file);
  }

  function cancelUpload() {
    xhrRef.current?.abort();
    setUploading(false);
    setProgress(0);
  }

  function removeFile() {
    cancelUpload();
    setFile(null);
    setProgress(0);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    handleFile(dropped);
  }

  return (
    <div>
      {/* DROP AREA */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed  rounded-2xl md:rounded-xl p-8 text-center cursor-pointer bg-white"
      >
        <input
          type="file"
          ref={inputRef}
          hidden
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />

        <UploadCloud className="mx-auto mb-3" />

        <p className="font-medium">Choose a file or drag & drop it here</p>

        <p className="text-xs text-gray-500">JPEG, PNG, PDF up to 10MB</p>

        {!file && (
          <button className="mt-4 px-4 py-2 bg-gray-100 rounded-full text-sm">Browse Files</button>
        )}

        {/* FILE PREVIEW */}
        {file && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-green-600">{file.name}</p>

            {/* PROGRESS BAR */}
            {uploading && (
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="flex justify-center gap-3 mt-2">
              {/* CANCEL */}
              {uploading && (
                <button
                  onClick={cancelUpload}
                  className="flex items-center gap-1 text-red-500 text-sm"
                >
                  <X size={16} /> Cancel
                </button>
              )}

              {/* CHANGE FILE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="flex items-center gap-1 cursor-pointer text-blue-500 text-sm"
              >
                <RotateCcw size={16} /> Change
              </button>

              {/* REMOVE */}
              {!uploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-gray-500 cursor-pointer text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="pt-2 text-[16px] text-ONE text-center">
        Upload images of your preferred document/image
      </p>
    </div>
  );
}
