"use client";

import React, { useRef, useState } from "react";
import { uploadFile } from "@/app/actions";
import { ApiResponse } from "@/types/types";
import Loading from "./admin/loading"; // Import the Loading component
import Swal from 'sweetalert2'; // Import SweetAlert2

interface ExamFileProps {
  examCentreId: number;
  examDateId: number;
  slotId: number;
  fileTypeId: number;
  fileTypeName: string;
  uploaded: boolean;
  userUploadedFilename: string | null;
}

const ExamFileUpload: React.FC<ExamFileProps> = ({
  examCentreId,
  examDateId,
  slotId,
  fileTypeId,
  fileTypeName,
  uploaded,
  userUploadedFilename,
}) => {
  const [status, setStatus] = useState(false);
  const [userSelectedFilename, setUserSelectedFilename] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [loading, setLoading] = useState(false); // State for loading
  const inputFileRef = useRef<HTMLInputElement>(null);
  const userUploadedFilenameRef = useRef<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      // Validate file types based on fileTypeName
      if (fileTypeName === "ATTENDANCE SHEET") {
        // Allow only PDF for scanned attendance
        if (fileExtension === 'pdf') {
          setUserSelectedFilename(file.name);
          setDisabledBtn(false);
          setStatus(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid file type',
            text: 'Only .pdf files are allowed for attendance sheets.',
          });
          setDisabledBtn(true);
          event.target.value = ""; // Reset file input
        }
      } else {
        // Allow only ZIP files for other file types
        if (fileExtension === 'zip') {
          setUserSelectedFilename(file.name);
          setDisabledBtn(false);
          setStatus(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid file type',
            text: 'Only .zip files are allowed for this file type.',
          });
          setDisabledBtn(true);
          event.target.value = ""; // Reset file input
        }
      }
    } else {
      setDisabledBtn(true);
      setStatus(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputFileRef.current && inputFileRef.current.files) {
      const file = inputFileRef.current.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("examCentreId", examCentreId.toString());
      formData.append("examDateId", examDateId.toString());
      formData.append("slotId", slotId.toString());
      formData.append("fileTypeId", fileTypeId.toString());

      setLoading(true); // Start loading

      try {
        const apiResponse: ApiResponse = await uploadFile(formData);
        if (!apiResponse.status) {
          console.error(
            `Error: status=${apiResponse.status}, message=${apiResponse.message}`
          );
          throw new Error("Error uploading exam file.");
        }
        setStatus(apiResponse.status);
        userUploadedFilenameRef.current = userSelectedFilename;
        setDisabledBtn(true);
        if (inputFileRef.current) {
          inputFileRef.current.value = "";
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text: 'There was an error uploading the exam file.',
        });
      } finally {
        setLoading(false); // Stop loading when done
      }
    }
  };

  return (
    <div className="relative w-full p-2 border-b-2 border-gray-300">
      {/* Overlay and Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-100">
          <Loading /> {/* Center the loading component */}
        </div>
      )}

      {/* Form content, which gets blurred when loading */}
      <div className={loading ? "blur-sm pointer-events-none" : ""}>
        <form onSubmit={handleSubmit} className="grid w-full grid-cols-3 gap-1 sm:grid-cols-12">
          <div className="col-span-1 flex items-center justify-center sm:col-span-3">
            <label>{fileTypeName}</label>
          </div>
          <div className="col-span-2 flex items-center justify-center sm:col-span-3">
            <input
              name="file"
              type="file"
              onChange={handleFileChange}
              ref={inputFileRef}
              className="w-full cursor-pointer rounded bg-gray-100 text-gray-500 file:mr-4 file:cursor-pointer file:border-0 file:bg-blue-500 file:py-1 file:text-white file:hover:bg-gray-700"
            />
          </div>
          <div className="col-span-1 flex items-center justify-center sm:col-span-2">
            <button
              type="submit"
              disabled={disabledBtn}
              className="w-full rounded-md bg-blue-700 px-5 py-2.5 text-center text-sm font-bold text-white disabled:bg-gray-200 disabled:text-black hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            >
              Upload
            </button>
          </div>
          <div className="col-span-2 flex items-center justify-center sm:col-span-3">
            <p className="w-full rounded text-gray-500 overflow-hidden">
              {uploaded && userUploadedFilenameRef.current === null
                ? userUploadedFilename
                : userUploadedFilenameRef.current}
            </p>
          </div>
          <div className="col-span-2 flex items-center justify-center sm:col-span-1">
            {status || uploaded ? (
              <svg
                className="h-6 w-6 flex-none fill-green-500 stroke-white stroke-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="12" />
                <path
                  d="m8 13 2.165 2.165 a1 1 0 0 0 1.521 -.126 L16 9"
                  fill="none"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <input type="hidden" name="examCentreId" value={examCentreId} readOnly />
          <input type="hidden" name="examDateId" value={examDateId} readOnly />
          <input type="hidden" name="slotId" value={slotId} readOnly />
          <input type="hidden" name="fileTypeId" value={fileTypeId} readOnly />
        </form>
      </div>
    </div>
  );
};

export default ExamFileUpload;
