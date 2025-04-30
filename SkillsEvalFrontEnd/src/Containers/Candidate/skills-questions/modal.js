import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseURL, Temp_token } from "../../../Api-config";



const Modal = ({ isOpen, onClose, questionsize, isSaved, text, sec, min, activityCount }) => {
    const navigate = useNavigate();
    const uuid = sessionStorage.getItem('uuid');

    const handleSubmit = async() => {
        const option = {
            method: 'PUT',
            headers: {
                "ngrok-skip-browser-warning": "69420",
                "Content-type": 'application/json'
            },
            body: JSON.stringify({ "status": "Ended" })
        }
        await fetch(`${BaseURL}/api/candidates/update-test-status/${uuid}`, option);
        localStorage.removeItem("start-test");
        localStorage.removeItem("uuid")
        navigate('/completed');
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg shadow-md p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4 text-center text-red-600">Warning!</h2>
                        <p className="text-gray-700 mb-4 text-center">{text}</p>
                        <h2 className="text-center mb-4">
                            <span className="text-gray-600">Answered</span>
                            <span className="font-bold text-3xl text-blue-500 ml-2">{isSaved}</span>
                            <span className="text-gray-600">/</span>
                            <span className="font-bold text-3xl text-blue-500 ml-2">{questionsize}</span>
                        </h2>                        {activityCount !== 3 && (sec !== 0 && min !== 0) && <div className="flex justify-between px-10">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Yes</button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>No</button>
                        </div>}
                        {(sec === 0 && min === 0) && <div className="flex justify-center px-10">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
                        </div>}

                        {activityCount === 3 && <div className="flex justify-center px-10">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
                        </div>}
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
