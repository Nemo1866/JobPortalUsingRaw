const passport = require("passport")
const { allCandidates, allRecruiters } = require("../controller/adminController")
const { registerCandidate, allJobs, login, welcome, login2, logout, applyJobs, appliedjobs } = require("../controller/canController")
const { postJob, registerRecruiter, candidateAppliedJobs } = require("../controller/recController")
const { isAuthenticatedCandidate, isAuthenticatedRecruiter } = require("../passport/passportConfig.")

let router=require("express").Router()

router.post("/register",registerCandidate)
router.get("/alljobs",isAuthenticatedCandidate,allJobs)
router.post("/login",passport.authenticate("local"),login2)
router.get("/applyjob/:id",isAuthenticatedCandidate,applyJobs)
router.get("/showapplied",isAuthenticatedCandidate,appliedjobs)



router.get("/logout",logout)


router.post("/recruiter/addjob",isAuthenticatedRecruiter,postJob)
router.get("/recruiter/viewjobs",isAuthenticatedRecruiter,candidateAppliedJobs)
router.post("/recruiter/register",registerRecruiter)


router.get("/admin/candidates",allCandidates)
router.get("/admin/recruiters",allRecruiters)
router.get("/admin/jobs",allJobs)


module.exports=router