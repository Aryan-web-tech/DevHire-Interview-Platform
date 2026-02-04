const express = require('express')
const {scheduleInterviews,getInterviews,joinMeeting,completeInterview,recordingWebhook, getMyRecordings} = require('../controller/interviewController')

router = express.Router()

router.post("/schedule",scheduleInterviews)
router.get("/user/:userId",getInterviews)
router.post("/:interviewId/call",joinMeeting)
router.patch("/:interviewId/complete",completeInterview)
router.post("/webhook/stream",recordingWebhook)
router.get("/recordings/:userId",getMyRecordings)

module.exports = router