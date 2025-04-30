import CandidateHeader from "./header"
import CandidateInstruction from "./instruction"

const CandidatePage = () => {
    return (
        <>
            <div>
                <div>
                    <CandidateHeader />
                </div>
                <div className="mt-4">
                    <CandidateInstruction />
                </div>
            </div>
        </>
    )
}
export default CandidatePage