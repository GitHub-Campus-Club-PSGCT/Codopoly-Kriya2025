import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bidding from './components/Bidding';
import Register from './components/Register';
import Login from './components/Login';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/bidding" element={<Bidding />} />
             </Routes>
        </Router>
    );
};

export default AppRouter;
