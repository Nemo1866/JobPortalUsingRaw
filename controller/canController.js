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
                
                let token=sign({email:result.email},process.env.SECRET,{expiresIn:'10m'})
                res.json({
                    msg:"Sucessfully Logged In",
                    token:token
                })
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
    },welcome:async(req,res)=>{
        res.send("hello")
    }
}

