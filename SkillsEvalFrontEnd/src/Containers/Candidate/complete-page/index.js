import { useEffect } from 'react';

const CompletePage = () => {
    const disableBrowserBack = () => {
        window.history.pushState(null, null, null);
        window.onpopstate = function () {
            window.history.pushState(null, null, null);
        };
    };

    useEffect(() => {
        disableBrowserBack()
    }, [])

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <div className="mb-4">
                    <h1 className="text-4xl font-bold">SkillsEval</h1>
                    <p className="text-lg">Spiraling The Recruitment Landscape</p>
                </div>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Thank You!</h1>
                    <p>Your Response Has Been Recorded</p>
                    <p>Our HRs / Recruiters Will Get Back To You Soon</p>
                </div>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-green-500">Have A Nice Day</h1>
                </div>
                <div className="mb-4">
                    <p className="mb-2">For any questions or concerns, please contact the administrator at</p>
                    <strong className="block">admin@mirafra.com / +91-9445210125</strong>
                </div>
                <div>
                    <p className="mb-2"><strong>SkillsEval</strong> © Copyrighted - 2024 Developed & Designed In <strong>Mirafra Technologies</strong>, Bengaluru, India.</p>
                </div>
            </div>
        </div>
    );
};

export default CompletePage;
