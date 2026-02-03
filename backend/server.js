require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const cron = require('node-cron')
const pool = require('./db/pool')
const authRoutes = require('./routes/authRoutes')
const interviewRoutes = require('./routes/interviewRoutes')
const {setupSocket} = require('./socket/socket')


const app = express()
const server = http.createServer(app)
app.use(cors({
  origin: [process.env.FRONTEND_URL,"http://localhost:3000"],
  credentials: true, 
}));
app.use(express.json())

app.use('/api/v1/auth/',authRoutes)
app.use('/api/v1/interview',interviewRoutes)

//set up socket
setupSocket(server)

cron.schedule('0 * * * *', async() => {
  try{
    const result = await pool.query(`
      UPDATE interviews
      SET status='expired'
      WHERE status='scheduled'
      AND scheduled_at < NOW() - INTERVAL '6 hours'
      RETURNING id, title, scheduled_at`);

    if(result.rows.length > 0) 
    {
      console.log("Expired meetings:", result.rows);
    }
  }
  catch (err) {
    console.error("Error expiring meetings:", err);
  }
})

server.listen(8000, () => {
    console.log("Server on port 8000")
    console.log('✅ Connected to Supabase PostgreSQL');
})