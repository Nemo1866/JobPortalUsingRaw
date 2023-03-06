let connection=require("../connection")
let {hash}=require("bcrypt")
const { getAllCandidates, getAllRecruiters, getAllAppliedJobs } = require("../func")
let xlsx=require("xlsx")
const {pagination}=require("../pagination")
const { schema } = require("../SchemaConfig")

module.exports={
    allCandidates:async(req,res)=>{
       let candidate=await getAllCandidates(connection)
       if(!candidate){
        res.send("Could not fine any data")
       }else{
        res.json({
            msg:candidate
        })
       }
    },allRecruiters:async(req,res)=>{
        let pageNumber=req.query.page
        let sizeNumber=req.query.size
        let {page,size}=pagination(pageNumber,sizeNumber)
        connection.query(`Select * from recruiters limit ${size} offset ${page*size}`,(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:data,
                    
                })
            }
        })
    },allJobs:async(req,res)=>{
        let pageNumber=req.query.page
        let sizeNumber=req.query.size
        let {page,size}=pagination(pageNumber,sizeNumber)
        connection.query(`Select * from jobs limit ${size} offset ${page*size}`,(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:data
                })
            }
        })
    },removeCandidate:(req,res)=>{
        connection.query("Delete from candidates where candidate_id = ?",[req.params.id],(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Sucessfully Deleted the Candidate"
                })
            }
        })
    },removeJob:(req,res)=>{
        connection.query("Delete from jobs where job_id = ?",[req.params.id],(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Sucessfully Deleted the job"
                })
            }
        })
    },removeRecruiter:(req,res)=>{
        connection.query("Delete from recruiters where recruiter_id = ?",[req.params.id],(err,data)=>{
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
        connection.query(`update recruiters set ? where recruiter_id = ${req.params.id}`,{firstName,lastName},(err,data)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Updated the recruiter"
                })
            }
        })
    },addRecruiter:async(req,res)=>{
        try {
            let {firstName,lastName,email,password}=req.body
            let hashPassword= await hash(password,10)
      
            let check=await schema.validateAsync(req.body)
    
            connection.query("insert into recruiters set ?",{firstName,lastName,email,password:hashPassword},async(err,data)=>{
                if(err){
                    res.send(err)
                    return 
                }
                    res.json({
                        msg:"Sucessfully added a recruiter"
                    })
                
            })
            
            
        } catch (error) {
            res.send(error)
            console.log(error);
        }
       
    },login:(req,res)=>{
        res.send(`Hello ${firstName} ${lastName}`)
    },allAppliedJobs:async(req,res)=>{
        let pageNumber=req.query.page
        let sizeNumber=req.query.size
        let {page,size}=pagination(pageNumber,sizeNumber)
        connection.query(`Select j.title,j.description,ap.candidate_id from appliedJobs ap inner join jobs j on j.job_id=ap.job_id limit ${size} offset ${page*size}`,(err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:result
                })
            }
        })
    }
    
    ,exportAll:async(req,res)=>{
        let candidate=await getAllCandidates(connection)
        let recruiter=await getAllRecruiters(connection)
        let appliedJobs=await getAllAppliedJobs(connection)

        

        let CandidateSheet=xlsx.utils.json_to_sheet(candidate)
        let RecruiterSheet=xlsx.utils.json_to_sheet(recruiter)
        let AppliedSheet=xlsx.utils.json_to_sheet(appliedJobs)

        let CandidateWorkBook=xlsx.utils.book_new()
        xlsx.utils.book_append_sheet(CandidateWorkBook,CandidateSheet,'Candidate')


        let RecruiterWorkBook=xlsx.utils.book_new()
        xlsx.utils.book_append_sheet(RecruiterWorkBook,RecruiterSheet,'Recruiter')


        let ApplyJobsWorkBook=xlsx.utils.book_new()
        xlsx.utils.book_append_sheet(ApplyJobsWorkBook,AppliedSheet,'Applied Jobs')

        xlsx.writeFile(CandidateWorkBook,"candidate.xlsx")
        xlsx.writeFile(RecruiterWorkBook,"recruiter.xlsx")
        xlsx.writeFile(ApplyJobsWorkBook,"appliedjobs.xlsx")

        res.json({msg:"Exported all the data"})

    },
    // registerAdmin:async(req,res)=>{
    //     let {firstName,lastName,email,password}=req.body
    //     let hashPassword=await hash(password,10)
    //     connection.query("insert into admin set ?",{firstName,lastName,email,password:hashPassword},(err,data)=>{
    //         if(err){
    //             res.send(err)
    //         }else{
    //             res.json({
    //                 msg:"Sucessfully added a admin"
    //             })
    //         }
    //     })
    // },

}