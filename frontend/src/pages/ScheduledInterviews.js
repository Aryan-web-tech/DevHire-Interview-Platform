import React, {useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import InterviewCard from '../components/InterviewCard'
import axios from 'axios'
import { AuthContext } from '../context/authContext'

export default function ScheduledInterviews() {
  const {user} = useContext(AuthContext)
  const [scheduledInterviews,setScheduledInterviews] = useState([])

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
    
  },[user.id])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Join your Scheduled Interviews
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduledInterviews.length !==0 ? scheduledInterviews.map( (interview) => (
            <InterviewCard key={interview.id}
              interview={interview} />
          )) : "No scheduled interviews for you right now"}
        </div>
      </div>
      
    </div>
  )
}
