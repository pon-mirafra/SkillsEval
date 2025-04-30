const Sidebar = ({ question, currentQuestionIndex, setCurrentQuestionIndex, savedQuestions }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '5px', boxSizing: 'border-box' }}>
            <div>
                {question.map((q, index) => (
                    <button
                        key={index}
                        className={`m-1 p-1 rounded-sm ${currentQuestionIndex === index ? 'bg-blue-500 text-white' : savedQuestions[index] ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}
                        onClick={() => setCurrentQuestionIndex(index)}
                        style={{ width: '50px', height: '35px', fontSize: '10px', lineHeight: '1', textAlign: 'center' }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default Sidebar