const connection=require("../connection")
const {hash}=require("bcrypt")
const { getRecruitersByEmail } = require("../func")
const { mail } = require("../mailConfig")
const { schemaReset } = require("../SchemaConfig")
const { pagination } = require("../pagination")

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

       

    },resetPasswordRecruiter: async (req, res) => {
        const { email } = req.body;
        let recruiter = await getRecruitersByEmail(connection, email);
        if (!recruiter) {
          res.send("Email Address Doest Not Exist");
          return;
        }
        let secret = "Hello" + recruiter.password;
        let payload = {
          firstName: recruiter.firstName,
          lastName: recruiter.lastName,
        };
        let token = jwt.sign(payload, secret, { expiresIn: "10m" });
        mail(
          "Reset Password Link",
          "Reset Password ",
          `Dear ${recruiter.firstName} ${recruiter.lastName} Thanks for choosing us here is your link for changing your password <br> http://localhost:3000/recruiter/resetpassword/${token}`,
          recruiter.email
        );
        res.json({
          msg: "Token Sent TO your email.",
        });
      },
    
      resetPasswordByTokenRecruiter: async (req, res) => {
        let { token } = req.params;
        let { email, password } = req.body;
    
        if (!token) {
          res.send("Please Provide token in order to change your password");
          return;
        }
        let recruiter = await getRecruitersByEmail(connection, email);
        let secret = "Hello" + recruiter.password;
    
        jwt.verify(token, secret, async (err, data) => {
          try {
            let hashPassword = await hash(password, 10);
            let check=await schemaReset.validateAsync(req.body)
            connection.query(
              `update recruiters set password = '${hashPassword}' where email = '${email}'`,
              (err, data) => {
                if (err) {
                  res.send(err);
                  return;
                }
                res.json({
                  msg: "Successfully Updated the password",
                });
              }
            );
          } catch (error) {
            res.send(error)
            
          }
          if (err) {
            res.send(err);
            return;
          }
        
        });
      },candidateAppliedJobs:(req,res)=>{
        let pageNumber=req.query.page
        let sizeNumber=req.query.size
        let {page,size}=pagination(pageNumber,sizeNumber)
        connection.query(`select * from recruiters where email = ? limit ${size} offset ${page*size}` ,[req.user.values[0]],(err,result)=>{
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