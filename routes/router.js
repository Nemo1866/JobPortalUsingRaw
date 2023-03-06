const passport = require("passport")
const { allCandidates, allRecruiters, registerAdmin, removeCandidate, removeJob, removeRecruiter, modifyRecruiter, allAppliedJobs, exportAll, addRecruiter } = require("../controller/adminController")
const { registerCandidate, allJobs, login, welcome, login2, logout, applyJobs, appliedjobs, resetPassword, resetPasswordByToken } = require("../controller/canController")
const { postJob, registerRecruiter, candidateAppliedJobs, resetPasswordRecruiter, resetPasswordByTokenRecruiter } = require("../controller/recController")
const { isAuthenticatedCandidate, isAuthenticatedRecruiter, isAuthenticatedAdmin } = require("../passport/passportConfig.")

let router=require("express").Router()

router.post("/register",registerCandidate)
router.get("/candidate/jobs",isAuthenticatedCandidate,allJobs)
router.post("/login",passport.authenticate("local"),login2)
router.get("/candidate/applyjob/:id",isAuthenticatedCandidate,applyJobs)
router.get("/candidate/showapplied",isAuthenticatedCandidate,appliedjobs)
router.post("/candidate/resetpassword",resetPassword)
router.post("/candidate/resetpassword/:token",resetPasswordByToken)



router.get("/logout",logout)


router.post("/recruiter/addjob",isAuthenticatedRecruiter,postJob)
router.get("/recruiter/viewjobs",isAuthenticatedRecruiter,candidateAppliedJobs)
router.post("/recruiter/resetpassword",resetPasswordRecruiter)
router.post("/recruiter/resetpassword/:id",resetPasswordByTokenRecruiter)


router.get("/admin/candidates",isAuthenticatedAdmin,allCandidates)
router.get("/admin/recruiters",isAuthenticatedAdmin,allRecruiters)
router.get("/admin/jobs",isAuthenticatedAdmin,allJobs)
router.get("/admin/appliedjobs",isAuthenticatedAdmin,allAppliedJobs)
router.post("/admin/recruiter/register",isAuthenticatedAdmin,addRecruiter)
router.get("/admin/removecandidate/:id",isAuthenticatedAdmin,removeCandidate)
router.get("/admin/removejob/:id",isAuthenticatedAdmin,removeJob)
router.get("/admin/removerecruiter/:id",isAuthenticatedAdmin,removeRecruiter)
router.post("/admin/updaterecruiter/:id",isAuthenticatedAdmin,modifyRecruiter)
router.get("/admin/exportall",isAuthenticatedAdmin,exportAll)




module.exports=router