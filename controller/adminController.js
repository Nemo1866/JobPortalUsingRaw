let connection=require("../connection")

module.exports={
    allCandidates:async(req,res)=>{
        connection.query("Select * from candidates",(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:data
                })
            }
        })
    },allRecruiters:async(req,res)=>{
        connection.query("Select * from recruiters",(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:data
                })
            }
        })
    },allJobs:async(req,res)=>{
        connection.query("Select * from jobs",(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:data
                })
            }
        })
    },removeCandidate:(req,res)=>{
        connection.query("Delete from candidates where id = ?",[req.params.id],(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Sucessfully Deleted the Candidate"
                })
            }
        })
    },removeJob:(req,res)=>{
        connection.query("Delete from jobs where id = ?",[req.params.id],(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Sucessfully Deleted the job"
                })
            }
        })
    },removeRecruiter:(req,res)=>{
        connection.query("Delete from recruiters where id = ?",[req.params.id],(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Sucessfully Deleted the Recruiter"
                })
            }
        })
    },modifyRecruiter:(req,res)=>{
        let {firstName,lastName}=req.body
        connection.query(`update recruiters set ? where id = ${req.params.id}`,{firstName,lastName},(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Updated the recruiter"
                })
            }
        })
    },addRecruiter:(req,res)=>{
        let {firstName,lastName,email,password}=req.body
        connection.query("insert into recruiters set ?",{firstName,lastName,email,password},(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Sucessfully added a recruiter"
                })
            }
        })
    },exportAll:async(req,res)=>{

    }
}