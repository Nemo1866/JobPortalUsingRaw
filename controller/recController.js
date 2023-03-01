const connection=require("../connection")

module.exports={
    postJob:async(req,res)=>{
        let {title,description,recruiter_id}=req.body

        connection.query("insert into jobs set ?",{title,description,recruiter_id},(err,data)=>{
            if(err){
                res.json({msg:"Could not add a post"+err})
                console.log(err);
            }else{
                res.json({msg:"Added a new job"})
            }
        })

    }
}