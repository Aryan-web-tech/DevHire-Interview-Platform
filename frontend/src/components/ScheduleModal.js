import React, { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import {AuthContext} from '../context/authContext'

export default function ScheduleModal({onClose}) {
    const {user} = useContext(AuthContext)
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [candidates,setCandidates] = useState([])
    const [candidateInput,setCandidateInput] = useState("")
    const [interviewers,setInterviewers] = useState([])
    const [interviewerInput,setInterviewerInput] = useState("")
    const [scheduledAt,setScheduledAt] = useState("")
    const [error,setError] = useState({
        title:"",
        candidates:"",
        interviewers:"",
        scheduledAt:""
    })

    const addCandidate = () => {
        if(candidateInput.trim() === "") return;

        setCandidates([...candidates,candidateInput.trim()])
        setCandidateInput("")
    }
    const addInterviewer = () => {
        if(interviewerInput.trim() === "") return;

        setInterviewers([...interviewers,interviewerInput.trim()])
        setInterviewerInput("")
    }

    const removeCandidate = (email) => {
        setCandidates(candidates.filter((em) => em !== email))
    }

    const removeInterviewer = (email) => {
        setInterviewers(interviewers.filter((em) => em !== email))
    }

    const handleSchedule = async () =>{

        const newErrors = {
            title: "",
            candidates: "",
            interviewers: "",
            scheduledAt: "",
        };

        if(!title.trim())
        {
            newErrors.title = "Title is required"
        }
        if (candidates.length === 0) 
        {
            newErrors.candidates = "Please add at least one candidate";
        }

        if (interviewers.length === 0) 
        {
            newErrors.interviewers = "Please add at least one interviewer";
        }

        if (!scheduledAt) 
        {
            newErrors.scheduledAt = "Please select date and time";
        }
        else
        {
            const selectedTime = new Date(scheduledAt)
            const now = new Date()
            if (selectedTime <= now) {
                newErrors.scheduledAt = "Please select a future time";
            }
        }

        if(Object.values(newErrors).some(err => err!==""))
        {
            setError(newErrors);
            return;
        }
        // Clear errors if everything is valid
        setError({
            title: "",
            candidates: "",
            interviewers: "",
            scheduledAt: "",
        });
        try{
            console.log(title,
                description,
                candidates,
                interviewers,
                scheduledAt)
            await axios.post("http://localhost:8000/api/v1/interview/schedule",{
                title,
                description,
                candidates,
                interviewers,
                scheduledAt:new Date(scheduledAt).toISOString(),
                created_by: user.id
            })

            onClose()
        }
        catch(error)
        {
            console.log(error)
            console.log("BACKEND MESSAGE:", error.response?.data);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-xl w-[380px] text-white">
                <h3 className="text-lg font-semibold mb-4">Schedule Interview</h3>

                <label className="text-sm mb-1 block">Title</label>
                <div className="flex gap-2 mb-2">
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) =>{ 
                            setTitle(e.target.value)
                            setError(prev => ({ ...prev, title: "" }));
                        }}
                        placeholder="Technical Round 1"
                        className='flex-1 p-2 rounded bg-zinc-800 border border-zinc-700'
                    />    
                </div>
                {error.title && (
                        <p className="text-red-400 text-xs mt-1">{error.title}</p>
                )}

                <label className="text-sm mb-1 block">Description</label>
                <div className="flex gap-2 mb-2">
                    <input 
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Coding and Aptitude Test"
                        className='flex-1 p-2 rounded bg-zinc-800 border border-zinc-700'
                    />    
                </div>

                {/*Candidate*/}
                <label className="text-sm mb-1 block">Candidate Emails</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="email"
                        value={candidateInput}
                        onChange={(e) => {
                            setCandidateInput(e.target.value)
                            setError(prev => ({ ...prev, candidates: "" }));
                        }}
                        placeholder="candidate@email.com"
                        className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                    <button onClick={addCandidate} className="px-3 rounded bg-indigo-600 hover:bg-indigo-500">
                        +
                    </button>
                </div>    
                {error.candidates && (
                    <p className="text-red-400 text-xs mt-1">{error.candidates}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                    {candidates.map((email,index) => (
                        <span
                        key={index}
                        className="bg-zinc-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                            {email}
                            <button className="text-zinc-300 hover:text-red-400"
                            onClick={() => removeCandidate(email)}>X</button>
                        </span>
                        
                    ))}
                </div>  
            
                {/*Interviewer*/}
                <label className="text-sm mb-1 block">Interviewer Emails</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="email"
                        value={interviewerInput}
                        onChange={(e) => {
                            setInterviewerInput(e.target.value)
                            setError(prev => ({ ...prev, interviewers: "" }));
                        }}
                        placeholder="interviewer@email.com"
                        className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                    <button onClick={addInterviewer} className="px-3 rounded bg-indigo-600 hover:bg-indigo-500">
                        +
                    </button>
                </div> 
                {error.interviewers && (
                    <p className="text-red-400 text-xs mt-1">{error.interviewers}</p>
                )}   

                <div className="flex flex-wrap gap-2 mb-4">
                    {interviewers.map((email,index) => (
                        <span
                        key={index}
                        className="bg-zinc-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                            {email}
                            <button className="text-zinc-300 hover:text-red-400"
                            onClick={() => removeInterviewer(email)}>X</button>
                        </span>
                        
                    ))}
                </div>

                <label className="text-sm mb-1 block">Date & Time</label>
                <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => {
                    setScheduledAt(e.target.value)
                    setError(prev => ({ ...prev, scheduledAt: "" }));
                }}
                min={new Date().toISOString().slice(0,16)}
                className="w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-700"
                /> 
                {error.scheduledAt && (
                    <p className="text-red-400 text-xs mb-3">{error.scheduledAt}</p>
                )}

                <div className="flex gap-3">
                    <button 
                        className="flex-1 bg-zinc-700 py-2 rounded hover:bg-zinc-600"
                        onClick={onClose} >
                        Close
                    </button>

                    <button
                        // disabled={interviewers.length === 0 || candidates.length===0}
                        onClick={handleSchedule}
                        className="flex-1 bg-indigo-600 py-2 rounded hover:bg-indigo-500"
                    >
                        Schedule
                    </button>
                </div>
            </div>    
        </div>        
    )
}
