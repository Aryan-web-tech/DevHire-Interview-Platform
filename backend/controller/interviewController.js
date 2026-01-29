const pool = require('../db/pool')
const { randomUUID } = require('crypto') 
const streamClient = require('../config/stream')

const getInterviews = async(req,res) =>{
    const userId = req.params.userId;
    const status = req.query.status;

    const result = await pool.query(`
        SELECT *FROM interviews WHERE status=$1 
        AND scheduled_at > NOW() - INTERVAL '6 hours'
        AND id IN (SELECT interview_id FROM interview_participants WHERE user_id=$2)`,
        [status,userId]); // not = bcoz may fail if multiple rows are present,hence use IN

    const interviews = result.rows;  

    return res.status(200).json({message:"Fetched schedueled interviews",interviews});
}

const joinMeeting = async(req,res) => {
    try{
        const {userId} = req.body
        const {interviewId} = req.params

        const result = await pool.query(`
            SELECT stream_call_id
            FROM interviews
            WHERE id = $1
            AND id IN (
                SELECT interview_id
                FROM interview_participants
                WHERE user_id = $2
            )`,[interviewId,userId]);

        if(result.rows.length == 0)
        {
            return res.status(403).json({message:"Access denied"});
        }

        const streamCallId = result.rows[0].stream_call_id;

        const token = streamClient.createToken(userId.toString());
        console.log(process.env.STREAM_API_KEY,token,streamCallId)
        return res.json({
            apiKey: process.env.STREAM_API_KEY,
            token,
            streamCallId
        });

    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const completeInterview = async(req,res) => {
    const {interviewId} = req.params;

    pool.query(`UPDATE interviews SET status='completed' WHERE id=$1`,[interviewId])

    res.json({ success: true });
}

const scheduleInterviews = async(req,res) => {
    try{
        
        const {title,description,candidates,interviewers,scheduledAt,created_by} = req.body;
    
        if (!title || !scheduledAt || candidates.length==0) {
            
            return res.status(400).json({ message: "Missing required fields" });
        }

        const streamCallId = randomUUID()

        await streamClient.video.call("default",streamCallId).create({
            data:{
                created_by_id:created_by
            }
        })

        //entering details in interviews table
        const interview = await pool.query(`
            INSERT INTO interviews(title,description,scheduled_at,stream_call_id,created_by)
            VALUES ($1, $2, $3, $4, $5) RETURNING id` , 
            [title,description,scheduledAt,streamCallId,created_by]);

        const interviewId = interview.rows[0].id;    

        await pool.query(`
            INSERT INTO interview_participants(interview_id,user_id,role)
            SELECT $1,id,'candidate'
            from users
            WHERE email = ANY($2)`,
            [interviewId,candidates]);

        await pool.query(`
            INSERT INTO interview_participants(interview_id,user_id,role)
            SELECT $1,id,'interviewer'
            from users
            WHERE email = ANY($2)`,
            [interviewId,interviewers]);

        return res.status(201).json({
            message:"Meeting created successfully",
            interview_id: interviewId,
            stream_call_id: streamCallId});
    }
    catch(error)
    {
        //implement rollback
        console.log(error)
    }
}

module.exports = {scheduleInterviews,getInterviews,joinMeeting,completeInterview}