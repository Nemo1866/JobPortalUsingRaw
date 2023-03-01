const connection=require("../connection")
const {hash}=require("bcrypt")



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
        

    },
    allJobs:async(req,res)=>{
        connection.query("select * from jobs",(err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.json({msg:result})
            }
        })
    },applyJobs:async(req,res)=>{
        connection.query("Select * from jobs where ")
    }
}

