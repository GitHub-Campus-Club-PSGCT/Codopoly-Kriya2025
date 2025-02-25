import SubmitQuestion from "../components/questions/SubmitQuestion";
import ViewQuestion from "../components/questions/ViewQuestion";

const QuestionPage = () => {
    return (
        <div className="container mx-auto">
            <SubmitQuestion />
            <ViewQuestion />
        </div>
    );
}

export default QuestionPage;