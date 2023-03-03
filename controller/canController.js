const connection=require("../connection")
const {hash,compare}=require("bcrypt")
const {sign}=require("jsonwebtoken")
require("dotenv").config()




module.exports={
    registerCandidate:async(req,res)=>{
        try {
          
            let {firstName,lastName,email,password}=req.body
            let hashPassword=await hash(password,10)
            connection.query("Insert into candidates set ?",{firstName,lastName,email,password:hashPassword},(err,result)=>{
              
                if(err){
                   
                    res.send("Email Address Already Exists")
                }else{
                    res.json({
                        msg:"Registered Sucessfully"
                    })
                }
            })

        
            
        } catch (error) {
            res.send("Some Error Occured")
            console.log(error);
        }
        

    },login:async(req,res)=>{
        try {  
            
            const {email,password}=req.body
       connection.query(`Select * from candidates where email = ?`,[email],async(err,result)=>{
        if(err){
            res.send("Some Error Occured")
        }
      
        else{
   
            let check=await compare(password,result[0].password)
        
            if(check){
                
                let token=sign({email:result[0].email},process.env.SECRET,{expiresIn:'10m'})
                
                res.json({
                    msg:"Sucessfully Logged In",
                    token:token
                })
                console.log(req);
            }else{
                res.json({
                    msg:"Enter a valid Password"
                })
            }
        }
        
        })
      
       
          
        } catch (error) {
            console.log(error);
            res.send("Some Error Occured")
        }
      
    },login2:(req,res)=>{
   
        res.send(`Welcome ${req.user.firstName}`)

    },
    allJobs:(req,res)=>{
        connection.query("select * from jobs",(err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.json({msg:result})
            }
        })
    },applyJobs:async(req,res)=>{
        connection.query(`Select * from jobs where job_id = ?`,[req.params.id],(err,result)=>{
            if(err){
                res.send(err)

            }else{
                connection.query("Select * from candidates where email = ?",[req.user.values[0]],(err,id)=>{
                    if(err){
                        res.send(err)
                    }else{
                        connection.query("Insert into appliedjobs values(default,?,?,?)",[result[0].recruiter_id,req.params.id,id[0].candidate_id],(err,data)=>{
                            if(err){
                                res.send(err)
                            }else{
                                res.json({
                                    msg:"Sucessfully Applied"
                                })
                            }
                        })
                        
                    }
                })
             
            }
        })
    },appliedjobs:(req,res)=>{
        connection.query("Select * from candidates where email = ?",[req.user.values[0]],(err,result)=>{
           
            
            if(err){
                res.send(err)
            }else{
            console.log(result);
                connection.query("Select cd.firstName,cd.lastName,j.title,j.description from appliedjobs ap inner join candidates cd on cd.candidate_id=ap.candidate_id inner join jobs j on j.job_id=ap.job_id  where ap.candidate_id =?",[result[0].candidate_id],(err,data)=>{
                    if(err){
                        res.send(err)
                    }else{
                        res.json({
                            msg:data
                        })
                    }
                })
            }
        })
       
    },welcome:async(req,res)=>{
        res.send("hello")
    },logout:(req,res)=>{
        req.logout(err=>{
            if(err){
                res.send(err)
            }else{
                res.json({
                    msg:"Sucessfully Logout"
                })
            }
        })
    }
}

