import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import jwtDecode from 'jwt-decode'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("")

  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const {setUser} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/auth/signup`, {
        name: username,
        email,
        password,
        role
      });
      const token = response.data.token
      localStorage.setItem("token", token)
      setUser(jwtDecode(token))
      navigate("/")
    } catch (error) {
      const message =
      error.response?.data?.message || "Signup failed";
      setError(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-900 p-10 rounded-2xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Signup to DevHire</h2>

        <label className="block text-white font-semibold mb-2">Username</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label className="block text-white font-semibold mb-2">Email</label>
        <input 
          type="text" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label className="block text-white font-semibold mb-2">Role</label>
        <div className="flex gap-6 mb-4 text-white">
          <label className="flex items-center gap-2">
            <input 
              type="radio" 
              name="role" 
              value="candidate" 
              onChange={(e) => setRole(e.target.value)}
              className="accent-purple-500 w-5 h-5"
            />
            Candidate
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="radio" 
              name="role" 
              value="interviewer" 
              onChange={(e) => setRole(e.target.value)}
              className="accent-purple-500 w-5 h-5"
            />
            Interviewer
          </label>
        </div>

        <label className="block text-white font-semibold mb-2">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}


        <button 
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-bold hover:from-pink-500 hover:to-purple-500 transition-all"
        >
          Signup
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account? <span className="text-purple-500 cursor-pointer" onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  )
}
