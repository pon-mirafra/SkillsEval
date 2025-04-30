import { useNavigate } from 'react-router-dom';
import './instruction.css'
import { useEffect } from 'react';


const CandidateInstruction = () => {
 
    const navigate = useNavigate();
    const handleTest = () => {
        sessionStorage.setItem('start-test','true')
        navigate('/questions');
    }
    const disableBrowserBack = () => {
        window.history.pushState(null, null, null);
        window.onpopstate = function () {
            window.history.pushState(null, null, null);
        };
    };
  
    useEffect(() => {
        const currentUrl = window.location.href;
        const parts = currentUrl.split('/');
        const uuidIndex = parts.indexOf('candidate') + 2;
        const extractedUuid = parts[uuidIndex];
        sessionStorage.setItem('uuid', extractedUuid);
    }, [])

    useEffect(() => {
        disableBrowserBack()
    }, [])

    return (
        <div className='flex flex-wrap mx-4' >
            <div className='lg:w-1/2'>
                <div>
                    <h1 className='font-bold text-1xl'>Instructions</h1>
                </div>
                <div className='text-sm mt-2'>
                    <ul>
                        <li><strong>1. Reliable Internet Connection:</strong> Please ensure you have a stable and strong internet connection throughout the test. Any connectivity issues may disrupt your test and could lead to disqualification.</li>
                        <li><strong>2. Supported Device:</strong> We recommend taking the test on a desktop or laptop computer for optimal performance. Using a mobile phone or tablet is not ideal and may affect your experience.</li>
                        <li><strong>3. Test Duration:</strong> A timer will be displayed on the screen showing the remaining time for completing the test. Please manage your time effectively to answer all questions within the allotted timeframe.</li>
                        <li><strong>4. Multiple Choice Questions (MCQs):</strong> This is an MCQ (Multiple Choice Question) format test. Read each question carefully and select the most appropriate answer from the options provided below each question.</li>
                        <li><strong>5. Complete All Questions:</strong> Try your best to attempt all questions within the given time frame. There is no negative marking, so even if you are unsure, it's best to choose an answer.</li>
                        <li><strong>6. Test Security:</strong> This is a proctored exam. Avoid any behavior that may be considered a violation of test security, such as using unauthorized materials, collaborating with others, or leaving the testing window.</li>
                        <li><strong>7. Technical Issues:</strong> If you encounter any technical difficulties during the test, please stop the test and immediately contact the administrator for assistance.</li>
                    </ul>
                </div>
            </div>
            <div className='lg:w-1/2 p-4'>
                <div>
                    <h1 className='font-bold text-1xl'>Test Conduct</h1>
                </div>
                <div className='text-sm mt-2'>
                    <ul>
                        <li>1. A maximum of 3 warnings will be issued if you attempt to navigate away from the test window during the exam. After the third warning, the test may be terminated.</li>
                        <li>2. Please maintain a quiet and distraction-free environment for the duration of the test.</li>
                        <li>3. Refrain from using any unauthorized materials or aids during the test.</li>
                        <li>4. Do not copy or share any test content with anyone.</li>
                    </ul>
                </div>
                <div>
                    <h1 className='font-bold text-1xl mt-4'>Additional Notes</h1>
                    <div className='text-sm mt-2'>
                        <ul>
                            <li>1. You can navigate through the test questions using the provided controls.</li>
                            <li>2. You can review your answers before submitting the final test.</li>
                            <li>3. Once you submit the test, you will not be able to make any changes.</li>
                        </ul>
                        <p>For any questions or concerns, please contact the Test Administrator at <strong>admin@mirafra.com/+91-9445210125</strong></p>
                        <p className='mt-2'>We wish you the best of luck on your test!</p>
                    </div>
                </div>
                <button className=' hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-12' onClick={handleTest}>Start Test</button>
            </div>
        </div>
    );
}

export default CandidateInstruction;
