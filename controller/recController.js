const connection=require("../connection")
const {hash}=require("bcrypt")

module.exports={
    postJob:async(req,res)=>{
        let {title,description}=req.body
        connection.query("select * from recruiters where email = ?",[req.user.values[0]],(err,rec)=>{
            
            if(err){
                res.send(err)
            }else{
               
                connection.query(`insert into jobs values (default,'${title}','${description}',${rec[0].recruiter_id})`,(err,data)=>{
                    if(err){
                        res.json({msg:"Could not add a post"+err})
                        console.log(err);
                    }else{
                        res.json({msg:"Added a new job"})
                    }
                })
            }
        })

       

    },registerRecruiter:async(req,res)=>{
        try {
          
            let {firstName,lastName,email,password}=req.body
            let hashPassword=await hash(password,10)
            connection.query("Insert into recruiters set ?",{firstName,lastName,email,password:hashPassword},(err,result)=>{
              
                if(err){
                   
                    res.send(err)
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
        

    },candidateAppliedJobs:(req,res)=>{
        connection.query("select * from recruiters where email = ?",[req.user.values[0]],(err,result)=>{
            if(err){
                res.send(err)
            }else{
                connection.query("Select * from appliedjobs where recruiter_id = ?",[result[0].recruiter_id],(err,data)=>{
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
        
        
    }
}