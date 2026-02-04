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

const recordingWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "call.recording_ready") {
      // support multiple payload shapes
      const recording =
        event.recording ||
        event.call_recording ||
        event.data?.recording ||
        event.data?.call_recording;
      let call_id =
        event.call_id || event.call_cid || event.data?.call_id || event.data?.call_cid;

      if (!recording || !call_id) {
        console.log("Missing recording or call_id in webhook payload:", event);
        return res.sendStatus(200);
      }

      // strip prefix like "default:<id>"
      if (typeof call_id === "string" && call_id.includes(":")) {
        call_id = call_id.split(":").pop();
      }

      // record id may be under id, session_id, or filename
      const recordingId = recording.id || recording.session_id || recording.filename || null;
      const url = recording.url || recording.playback_url || recording.download_url || null;

      if (!url) {
        console.log("Missing url in recording object:", recording);
        return res.sendStatus(200);
      }

      // find interview by stream_call_id (the streamCallId you created)
      const interviewInfo = await pool.query(
        `SELECT id, created_by FROM interviews WHERE stream_call_id = $1`,
        [call_id]
      );

      if (interviewInfo.rows.length === 0) {
        console.log("No interview found for call_id:", call_id);
        return res.sendStatus(200);
      }

      const interview = interviewInfo.rows[0];

      await pool.query(
        `INSERT INTO recordings (interview_id, recording_url, stream_recording_id, created_by)
         VALUES ($1, $2, $3, $4)`,
        [interview.id, url, recordingId, interview.created_by]
      );

      console.log("Recording saved for interview:", interview.id, "url:", url, "recordingId:", recordingId);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error : ", err);
    res.sendStatus(500);
  }
};

const getMyRecordings = async(req,res) => {
        const userId = req.params.userId;

        const result = await pool.query(`
            SELECT r.id,r.recording_url,i.title,i.scheduled_at
            FROM recordings r
            JOIN interviews i ON r.interview_id=i.id
            WHERE i.created_by = $1
            ORDER BY i.scheduled_at DESC`,[userId])
        
        res.json({ recordings: result.rows });    
}

module.exports = {scheduleInterviews,getInterviews,joinMeeting,completeInterview,recordingWebhook,getMyRecordings}