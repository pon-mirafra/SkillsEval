import { useEffect, useState, useRef } from "react";
// import { mock_questions as question } from "./mock-data";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { BaseURL, Temp_token } from "../../../Api-config";
import BrowserActivityTracker from "./browseractivity";
import Spinner from "./spinner";
import Modal from "./modal";
import Sidebar from './question-sidebar';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'




const CandidateQuestions = () => {
    const { activityCount, setActivityCount } = BrowserActivityTracker()
    const navigate = useNavigate();
    const [question, setQuestions] = useState([])
    const [clickedOptions, setClickedOptions] = useState([]);
    const [loading, setLoading] = useState(true)
    const [savedQuestions, setSavedQuestions] = useState([]);
    const [min, setMin] = useState(0)
    const [sec, setSec] = useState(0)
    const [isOpen, setIsOpen] = useState(false);
    const refClock = useRef(null)
    const refsec = useRef(null)
    const ref = useRef(Date.now())
    const savedAnswer = savedQuestions?.filter(e => e !== false).length || 0;
    const uuid = sessionStorage.getItem('uuid');
    const startTest = sessionStorage.getItem('start-test')
    const [answer, setAnswer] = useState('')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [handleNextQuestionClicked, setHandleNextQuestionClicked] = useState(true);
    const [updateTimerStatus, setUpdateTimerStatus] = useState(true)
    const isOnline = window.navigator.onLine;

    console.log('isOnline', isOnline)

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setHandleNextQuestionClicked(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < question?.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setHandleNextQuestionClicked(false);
        }
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleOptionClick = (questionIndex, optionIndex, option) => {
        setAnswer(option)
        setClickedOptions(prevState => {
            const newState = [...prevState];
            newState[questionIndex] = optionIndex;
            return newState;
        });
    };
    const convertToMinutesAndSeconds = (time) => {
        var minutes = Math.floor(time);
        var seconds = Math.round((time - minutes) * 60);
        setMin(minutes)
        setSec(seconds)
    }

    const updateQuestionTime = async (m, s) => {
        try {
            const data = {
                "warningCount": activityCount || 0, //activityCount
                "timer": {
                    "minutes": m || 0,
                    "seconds": s || 0
                }
            }
            const option = {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${Temp_token}`,
                    "ngrok-skip-browser-warning": "69420",
                    "Content-type": 'application/json'
                },
                body: JSON.stringify(data)
            }
            if (uuid) {
                const response = await fetch(`${BaseURL}/api/candidates/update-test-details/${uuid}`, option);
                const json = await response.json();
                setUpdateTimerStatus(json?.success)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
            refsec.current++;
            if (refsec.current === 5) {
                if (updateTimerStatus && activityCount <= 3 && isOnline) updateQuestionTime(min, sec);
                refsec.current = 0;
            }
        }, 1000);

        return () => clearInterval(intervalId);

    }, [min, sec, activityCount, updateTimerStatus]);



    const getAllQuestions = async () => {
        try {
            const option = {
                method: 'PUT',
                headers: {
                    // "Authorization": `Bearer ${Temp_token}`,
                    "ngrok-skip-browser-warning": "69420",
                    "Content-type": 'application/json'
                },
                body: JSON.stringify({ "status": "In-Progress" })
            }

            const response = await fetch(`${BaseURL}/api/candidates/update-test-status/${uuid}`, option);
            const json = await response.json();
            setQuestions(json.data?.questions ?? [])
            if (startTest === 'true') {
                convertToMinutesAndSeconds(json.data?.userDuration?.value || 0)
                setActivityCount(json?.data?.warning || 0)
                sessionStorage.setItem('start-test', 'false')
            } else {
                if (handleNextQuestionClicked) {
                    convertToMinutesAndSeconds(json.data?.userDuration?.value || 0)
                    setActivityCount(json?.data?.warning || 0)
                }
            }

            setSavedQuestions(json?.data?.questions.map((e, i) => e.userAnswer !== 'Not Answered'));
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }
    const handleSave = async (item, questionIndex) => {
        const data = {
            "questionId": item?.question?._id,
            "userAnswer": answer
        }
        if (clickedOptions[questionIndex] !== false) {
            if (answer) {
                if (Date.now() - ref.current >= 1000) {
                    ref.current = Date.now()
                    const option = {
                        method: 'PUT',
                        headers: {
                            "Authorization": `Bearer ${Temp_token}`,
                            "ngrok-skip-browser-warning": "69420",
                            "Content-type": 'application/json'

                        },
                        body: JSON.stringify(data)

                    }
                    const result = await fetch(`${BaseURL}/api/candidates/save-answer?uuidToken=${uuid}`, option);
                    setAnswer('')
                    toast.success('Answer saved successfully!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        style: {
                            width: '400px',
                            minHeight: '80px',
                        }
                    });
                }
            }
        }
    };

    const submitTest = async () => {
        if (savedQuestions?.every(saved => saved === true)) {
            const option = {
                method: 'PUT',
                headers: {
                    "ngrok-skip-browser-warning": "69420",
                    "Content-type": 'application/json'
                },
                body: JSON.stringify({ "status": "Ended" })
            }
            await fetch(`${BaseURL}/api/candidates/update-test-status/${uuid}`, option);
            sessionStorage.removeItem("start-test");
            sessionStorage.removeItem("uuid")
            navigate('/completed');
        } else {
            openModal()
        }
    }

    const disableBrowserBack = () => {
        window.history.pushState(null, null, null);
        window.onpopstate = function () {
            window.history.pushState(null, null, null);
        };
    };
    useEffect(() => {
        disableBrowserBack()
    }, [])
    useEffect(() => {
        isOnline && getAllQuestions()
    }, [currentQuestionIndex])

    useEffect(() => {
        setClickedOptions(new Array(question?.length).fill(false));
    }, [question])

    useEffect(() => {
        if (activityCount < 3 && isOnline) {
            if (min > 0 || sec > 0) {
                let remainingTime = min * 60 + sec;
                refClock.current = setInterval(() => {
                    if (remainingTime > 0) {
                        let newMin = Math.floor(remainingTime / 60);
                        let newSec = remainingTime % 60;
                        remainingTime -= 1;
                        setMin(newMin);
                        setSec(newSec);
                    } else {
                        clearInterval(refClock.current);
                        setMin(0)
                        setSec(0)
                    }
                }, 1000);
            }
            return () => clearInterval(refClock.current);
        } else {
            clearInterval(refClock.current);
        }
    }, [min, sec, activityCount, isOnline]);


    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "";
            const confirmationMessage = "Are you sure you want to leave?";
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);


    return (
        <>
            {loading ? <Spinner /> : (
                <>
                    <div className="sticky top-0 z-50 bg-white w-full p-4">
                        {question?.length !== 0 && <div className='header flex justify-between items-center'>
                            <div className='section'>
                                <h1 className="text-xl font-bold">SkillsEval - Examination</h1>
                            </div>
                            <div className='question-timer flex items-center space-x-4'>
                                <h5 className="text-base font-semibold">Warnings Count</h5>
                                <div className="tooltips flex items-center space-x-4" data-tooltip-variant="info"
>
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                >
                                    <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
                                    <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>

                                <div >
                                    <button style={{ backgroundColor: activityCount === 1 ? 'orange' : activityCount === 2 ? "red" : '' }}> {activityCount}</button>
                                </div>
                                </div>
                                <h5 className="text-base font-semibold">Timer</h5>
                                <button className='header-btn'>{min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}</button>
                            </div>
                        </div>}
                    </div>
                    <Tooltip anchorSelect=".tooltips" place="top" >
                        <p>Maximum of 3 warnings for navigating away from the test window.</p>
                    </Tooltip>
                    <div style={{ position: 'relative' }} className="mr-4 ml-4">
                        {/* Sidebar */}
                        <div>
                            {question?.length > 0 && (
                                <>
                                    {isOnline ? <Sidebar isOnline={isOnline} question={question} currentQuestionIndex={currentQuestionIndex} clickedOptions={clickedOptions} setCurrentQuestionIndex={setCurrentQuestionIndex} savedQuestions={savedQuestions} />
                                        : <div className="flex justify-center items-center"><h2 className="text-xl font-bold text-black-300">No Internet Connection</h2></div>}
                                </>
                            )}
                        </div>

                        {/* Main content */}
                        {question?.length > 0 && (
                            <div className="flex">
                                <div className="flex-grow m-1">
                                    <div className="bg-white p-4 rounded-md shadow-md" style={{ cursor: 'pointer' }}>
                                        <p className="font-semibold mb-2">{currentQuestionIndex + 1}. {question[currentQuestionIndex]?.question?.question_text}</p>
                                        {question[currentQuestionIndex]?.question?.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex items-center smb-2 m-1">
                                                <input
                                                    type="text"
                                                    onClick={() => handleOptionClick(currentQuestionIndex, optionIndex, option)}
                                                    value={option}
                                                    readOnly
                                                    className={`mr-2 border-gray-300 border rounded-md p-2 flex-grow ${clickedOptions[currentQuestionIndex] === optionIndex ? "bg-green-200" :
                                                        question[currentQuestionIndex]?.userAnswer === option ? "bg-green-200" : "hover:bg-gray-200"
                                                        }`}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ position: 'sticky', bottom: '2px', right: '5px', textAlign: 'center' }}>
                                            <div className="mt-3 flex justify-center items-center">
                                                <div style={{ justifyContent:'space-between'}} >
                                                    <div>
                                                    <button  onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="m-2">&#10094; Previous</button>

                                                    </div>
                                                    <div>
                                                    {currentQuestionIndex !== question?.length - 1 && 
                                                    <button   onClick={() => { handleSave(question[currentQuestionIndex], currentQuestionIndex); handleNextQuestion(); }}>Save & Next &#10095;</button>
                                                    }
                                                    </div>
                                                    
                                                    {currentQuestionIndex === question?.length - 1 && 
                                                    <button style={{ backgroundColor: 'green' }} onClick={() => { handleSave(question[currentQuestionIndex], currentQuestionIndex); handleNextQuestion(); submitTest() }}>Save & Submit</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: '2px', right: '5px', paddingTop: '10px' }}>
                                        <div>
                                            <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="m-2">&#10094; Previous</button>
                                        </div>
                                        <div className="px-2">
                                            {currentQuestionIndex !== question?.length - 1 &&
                                                <button onClick={() => { handleSave(question[currentQuestionIndex], currentQuestionIndex); handleNextQuestion(); }} >Save & Next &#10095;</button>
                                            }
                                            {currentQuestionIndex === question?.length - 1 &&
                                                <button style={{ backgroundColor: 'green' }} onClick={() => { handleSave(question[currentQuestionIndex], currentQuestionIndex); handleNextQuestion(); submitTest() }}>Save & Submit</button>
                                            }
                                        </div>
                                    </div>


                                </div>
                            </div>
                        )}

                        {/* Submit button */}
                        {question?.length > 0 && (
                            <div style={{ position: 'absolute', bottom: '-80px', right: '10px' }}>
                                <div className="flex justify-center items-center">
                                    {currentQuestionIndex !== question?.length - 1 && <button style={{ backgroundColor: 'green' }} onClick={submitTest}>Submit Test</button>}
                                </div>
                            </div>
                        )}


                    </div>

                    {uuid === null ?
                        <div>
                            <div className="flex justify-center items-center h-screen">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-black-500">The URL is not valid</h1>
                                    <p className="mb-4">Please reach out to the Recruiter.</p>
                                </div>
                            </div>
                        </div> :
                        <div>
                            {question?.length === 0 && <div className="flex justify-center items-center h-screen">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-black-500">Your Test is Submited</h1>
                                    <p className="mb-4">Please reach out to the Recruiter.</p>
                                </div>
                            </div>}
                        </div>
                    }
                </>
            )
            }
            <ToastContainer />
            <Modal isOpen={isOpen} onClose={closeModal} isSaved={savedAnswer} questionsize={question?.length || 0} text='Are you sure you want to submit?' />
            {sec === 0 && min === 0 && question?.length > 0 && <Modal sec={sec} min={min} isOpen={true} onClose={closeModal} isSaved={savedAnswer} questionsize={question?.length || 0} text='The given time has been completed' />}
            {activityCount === 3 && question.length > 0 && <Modal activityCount={activityCount} isOpen={true} onClose={closeModal} isSaved={savedAnswer} questionsize={question?.length || 0} text='You reach out the maximum limit.Your answer saved.Thanks ' />}
        </>
    )
}

const CandidateFullscreen = () => {
    return (
        <>
            <CandidateQuestions />
        </>
    )
}
export default CandidateFullscreen
