import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useContext,useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import InterviewCard from '../components/InterviewCard'
import DashboardCard from '../components/DashboardCard'
import ScheduleModal from '../components/ScheduleModal'
import axios from 'axios'

export default function JoinInterviewPage() {
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const [scheduledInterviews,setScheduledInterviews] = useState([])
    const [openModal,setOpenModal] = useState(false)

    useEffect(() => {
      const fetchData = async() => {
        try{

            const response = await axios.get(`http://localhost:8000/api/v1/interview/user/${user.id}?status=scheduled`);
            setScheduledInterviews(response.data.interviews)
          }
          catch(error)
          {
            console.log(error);
          }
      }
      fetchData()

      // fetch data every 5 seconds
      const intervalId = setInterval(() => {fetchData()},5000);

      return () => clearInterval(intervalId);
    
  },[])


    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-8">
                {user.role === "interviewer"
                ? "Manage your interviews and review candidates effectively"
                : "Access your upcoming interviews and preparations"}
                </h1>

                {user.role==="candidate" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scheduledInterviews.length !==0 ? scheduledInterviews.map((interview) => (
                            <InterviewCard key={interview.id}
                                interview={interview} 
                            />
                        )) : "No scheduled interviews for you right now"}
                    </div>    
                )}

                {user.role==="interviewer" && (
                    <div className="grid md:grid-cols-3 gap-6">
                        <DashboardCard title="Upcoming Interviews"
                            description="Manage and Join Interviews"
                            onClick={() => navigate("/interviewer/scheduled")}
                        />

                        <DashboardCard title="Schedule Interviews"
                            description="Schedule Interviews at your preferred time"
                            onClick={() => setOpenModal(true)}
                        />

                        <DashboardCard title="Recordings"
                            description="Watch previous interview recordings"
                            onClick={() => navigate("/interviewer/recordings")}    
                        />        
                    </div>
                )}
            </div>

            {openModal && <ScheduleModal onClose={() => setOpenModal(false) } />}
        </div>
    )
}
