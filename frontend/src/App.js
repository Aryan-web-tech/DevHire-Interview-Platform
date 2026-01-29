import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import { AuthContext } from './context/authContext';
import { useContext } from 'react';
import JoinInterviewPage from './pages/Dashboard'
import ScheduledInterviews from './pages/ScheduledInterviews'
import Recordings from './pages/Recordings';
import InterviewCall from './pages/InterviewCall';
import InterviewLobby from './pages/InterviewLobby';

function App() {
  const {user} = useContext(AuthContext)

  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ user ? <Home/> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login/> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup/> : <Navigate to="/" />} />
            <Route path="/dashboard" element={user ? <JoinInterviewPage /> : <Navigate to ="/login" />} />
            <Route path="/interviewer/scheduled" element={user ? <ScheduledInterviews/> : <Navigate to="/login"/> } />
            <Route path="/interviewer/recordings" element={user ? <Recordings/> : <Navigate to="/login"/> } />
            <Route path="/interview/:interviewId/lobby" element={<InterviewLobby />} />
            <Route path="/interview/:interviewId/call" element={<InterviewCall />} />

          </Routes>  
        </BrowserRouter>
    </div>
  );
}

export default App;
