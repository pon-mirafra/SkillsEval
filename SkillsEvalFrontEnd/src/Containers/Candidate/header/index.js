import React from 'react';
import { BaseURL, Temp_token } from "../../../Api-config";
import { useEffect, useState } from 'react';



const CandidateHeader = () => {
    const [testInfo, setTestInfo] = useState({})
    const [min, setMin] = useState(0)
    const [sec, setSec] = useState(0)
    const { userId, questionsCount } = testInfo || {}

    const convertToMinutesAndSeconds = (time) => {
        var minutes = Math.floor(time);
        var seconds = Math.round((time - minutes) * 60);
        setMin(minutes)
        setSec(seconds)

    }
    const getTestInfo = async (id) => {
        try {
            const option = {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${Temp_token}`,
                    "ngrok-skip-browser-warning": "69420",
                    "Content-type": 'application/json'
                }
            }
            const response = await fetch(`${BaseURL}/api/candidates/get-test-info/${id}`, option);
            const json = await response.json();
            setTestInfo(json.test)
            convertToMinutesAndSeconds(json?.test?.testDuration?.value)
        } catch (err) {
        }
    }
    useEffect(() => {
        const uuid = sessionStorage.getItem('uuid');
        if (uuid) getTestInfo(uuid)
    }, [])
    return (
        <div className="header flex justify-between items-center bg-white p-4 ">
            <div className='candidate-name'>
                <h3 className="text-base font-semibold text-blue-800">Welcome,{userId?.name}!</h3>
                <h4 className="text-sm text-gray-600">Email ~ {userId?.email}</h4>
            </div>
            <div className='section'>
                <h1 className="text-xl font-bold">SkillsEval - Guidelines</h1>
            </div>
            <div className='question-timer flex items-center space-x-4'>
                <h5 className="text-base font-semibold">Question-count</h5>
                <button className='header-btn'>{questionsCount || 0}</button>
                <h5 className="text-base font-semibold">Duration</h5>
                <button className='header-btn'>{min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}</button>
            </div>
        </div>
    );
}

export default CandidateHeader;
