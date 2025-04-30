import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generate, subject, sendMail } from '../Api-config/auth.api';
import { Clipboard } from 'lucide-react';

const schema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  difficulty: yup.string().required('Difficulty level is required'),
});

const GetLink = () => {
  const { handleSubmit, register, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(schema),
  });
  
  const [generatedLink, setGeneratedLink] = useState('');
  const [subjects, setSubjects] = useState([]);
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
  
  const onSubmit = async (data) => {
    try {
      const response = await generate(data, token);
      const link = response.data.link;
      setGeneratedLink(link);
      toast.success('Link generated successfully');
    } catch (error) {
      console.error('Error generating link:', error);
      toast.error('Failed to generate link');
    }
  };
  
  const sendEmail = async () => {
    const data = getValues();
    const emailData = {
      name: data.name,
      toEmail: data.email,
      subject: "SkillsEval ~ Recruitment Test Notification",
      testLink: generatedLink
    };
    
    try {
      await sendMail(emailData, token);
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch((error) => {
        console.error('Error copying link:', error);
        toast.error('Failed to copy link');
      });
  };

  return (
    <div>
      <ToastContainer />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto mt-8">
  
        <div className="mb-4">
          <label htmlFor="search" className="block text-black-700 font-bold text-left mb-2 text-2xl">
          Generate Test Link
          </label>
          <label htmlFor="name" className="block text-gray-700 font-bold text-left text-lg">Enter name</label>
          <input type="text" {...register("name")} className="form-input mt-2 py-1 px-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-400" />
          {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold text-left text-lg">Email</label>
          <input type="email" {...register("email")} className="form-input mt-2 py-1 px-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-400" />
          {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-bold text-left text-lg">Choose subject</label>
          <select {...register("subject")} className="form-select mt-2 py-1 px-2 block w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-400" >
            <option value="">Select</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject._id}>{subject.subject_name}</option>
            ))}
          </select>
          {errors.subject && <p className="text-red-500 mt-1">{errors.subject.message}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="difficulty" className="block text-gray-700 font-bold text-left text-lg">Difficulty level</label>
          <select {...register("difficulty")} className="form-select mt-2 py-1 px-2 block w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-400">
            <option value="">Select</option>
            <option value="easy">Easy (0-2)</option>
            <option value="medium">Medium (2-5)</option>
            <option value="difficult">Difficult (5+)</option>
          </select>
          {errors.difficulty && <p className="text-red-500 mt-1">{errors.difficulty.message}</p>}
        </div>

        <div className="mb-4">
          <button type="submit" className="bg-sky-800 hover:bg-sky-900 text-lg text-white font-bold py-1 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50">Generate</button>
        </div>

        {generatedLink && (
          <div className="mb-4">
            <label htmlFor="testUrl" className="block text-gray-700 font-bold text-left text-lg">Test URL</label>
            <input type="text" readOnly className="form-input mt-2 py-1 px-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-400" value={generatedLink} />
            <div className="flex justify-between mt-4">
              <button type="button" onClick={sendEmail} className="bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Send mail</button>
              <button type="button" onClick={copyToClipboard} className="bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Copy Link
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default GetLink;
