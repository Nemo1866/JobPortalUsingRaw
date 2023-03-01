const { allCandidates, allRecruiters } = require("../controller/adminController")
const { registerCandidate, allJobs } = require("../controller/canController")
const { postJob } = require("../controller/recController")

let router=require("express").Router()

router.post("/register",registerCandidate)
router.get("/alljobs",allJobs)


router.post("/recruiter/addjob",postJob)


router.get("/admin/candidates",allCandidates)
router.get("/admin/recruiters",allRecruiters)
router.get("/admin/jobs",allJobs)


module.exports=router