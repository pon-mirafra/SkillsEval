import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { jsDownload } from "react-use-downloader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { subject, upload, addSubject } from "../Api-config/auth.api";

const schema = yup.object().shape({
  subject: yup.string().required("Subject is required"),
});

const SetQuestion = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await subject(token);
      setSubjects(response);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const handleChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleAddSubject = async (data) => {
    try {
      const response = await addSubject(data.subject, token);
      toast.success("Subject added successfully!");
      setSubjects([...subjects, response.data]);
      setShowModal(false);
      reset();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Subject already exists");
      } else {
        console.error('Error adding subject:', error);
        toast.error("Failed to add subject");
      }
    }
  };

  const uploadFile = async (file) => {
    try {
      const allowedFormats = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!allowedFormats.includes(file.type)) {
        setUploadError("Unsupported file format");
        setErrorMessage("");
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      await upload(formData, selectedSubject, token);
      toast.success("Successfully uploaded!");
      setErrorMessage("");  // Clear any previous error messages
      setUploadError("");   // Clear any previous format error
    } catch (error) {
      if (error.response && error.response.status === 500) {
        const errorMessages = error.response.data.message
          .map(err => `Row ${err.errorRowIndex}: ${err.errors.map(e => e.message).join(', ')}`)
          .join('\n');
        setErrorMessage(errorMessages);
      } else {
        console.error('Error uploading file:', error);
        toast.error("Failed to upload file");
      }
    }
  };

  const handleDownloadExcel = () => {
    jsDownload("https://docs.google.com/spreadsheets/d/1qRV4HwET8gdrEioJIQxupjPr_zCMNbadQrYNZTL1rbQ/edit#gid=990884233", "excel-file.xlsx");
    toast.success("Successfully downloaded!");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedFormats = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (file && allowedFormats.includes(file.type)) {
      setUploadError("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <label htmlFor="search" className="block text-black-700 font-bold text-left mb-4 text-2xl">
          Add Questions To Bank
      </label>
      <ToastContainer />

      <div className="mb-4">
        <p className="text-md italic mb-4">*Click the below button to download the Excel template for question formatting.*</p>
        <button
          className="bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 w-auto"
          onClick={handleDownloadExcel}
        >
          Download
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="chooseSubject" className="block text-gray-700 font-bold text-left text-lg">Choose Subject</label>
        <select
          id="chooseSubject"
          className="form-select mt-2 py-1 px-2 block w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-400"
          value={selectedSubject}
          onChange={handleChange} 
        >
          <option value="">Select</option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject._id}>{subject.subject_name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between mb-4">
        <button
          className="bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 w-auto"
          onClick={() => setShowModal(true)}
        >
          Add Subject
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 w-96 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Subject</h2>
            <form onSubmit={handleSubmit(handleAddSubject)}>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className={`form-input mt-2 py-1 px-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-400 ${errors.subject ? 'border-red-500' : ''}`}
                  {...register('subject')}
                />
                {errors.subject && <p className="text-red-500 mt-1">{errors.subject.message}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-sky-800 hover:bg-sky-900 text-white font-bold py-1 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 "
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="file"
          id="fileInput"
          className="form-input mt-1 block font-bold w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        {uploadError && <p className="text-red-500 mt-1">{uploadError}</p>}
      </div>

      <button
        className="bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 w-auto"
        onClick={() => {
          const fileInput = document.getElementById("fileInput");
          if (fileInput.files.length > 0) {
            uploadFile(fileInput.files[0]);
          } else {
            toast.error("Please select a file to upload.");
          }
        }}
      >
        Upload
      </button>

      {errorMessage && (
        <div className="mt-4 bg-red-100 p-4 rounded-md">
          <h3 className="text-red-700 font-bold">Upload Errors:</h3>
          <pre className="text-red-700 whitespace-pre-wrap">{errorMessage}</pre>
        </div>
      )}
    </div>
  );
};

export default SetQuestion;
