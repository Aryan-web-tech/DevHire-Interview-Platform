const express = require('express')
const {scheduleInterviews,getInterviews,joinMeeting,completeInterview} = require('../controller/interviewController')

router = express.Router()

router.post("/schedule",scheduleInterviews)
router.get("/user/:userId",getInterviews)
router.post("/:interviewId/call",joinMeeting)
router.patch("/:interviewId/complete",completeInterview)

module.exports = router