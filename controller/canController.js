const connection = require("../connection");
const { hash, compare } = require("bcrypt");

const jwt = require("jsonwebtoken");
const { getCandidatesByEmail, getRecruitersByEmail, getRecruitersById } = require("../func");

const { mail } = require("../mailConfig");
const { schema, schemaPassword, schemaReset } = require("../SchemaConfig");
const { pagination } = require("../pagination");
require("dotenv").config();

module.exports = {
  registerCandidate: async (req, res) => {
    try {
      let { firstName, lastName, email, password } = req.body;
      let hashPassword = await hash(password, 10);
      let check=await schema.validateAsync(req.body)
      connection.query(
        "Insert into candidates set ?",
        { firstName, lastName, email, password: hashPassword },
        async(err, result) => {
          if (err) {
            res.send("Email Address Already Exists");
            return;
          }
          
          res.json({
            msg: "Registered Sucessfully",
          });
        }
      );
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  },
  login2: (req, res) => {
    res.send(`Welcome ${req.user.firstName}`);
  },
  resetPassword: async (req, res) => {
    const { email } = req.body;
    let candidate = await getCandidatesByEmail(connection, email);
    if (!candidate) {
      res.send("Email Address Doest Not Exist");
      return;
    }
    let secret = "Hello" + candidate.password;
    let payload = {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
    };
    let token = jwt.sign(payload, secret, { expiresIn: "10m" });
    mail(
      "Reset Password Link",
      "Reset Password ",
      `Dear ${candidate.firstName} ${candidate.lastName} Thanks for choosing us here is your link for changing your password <br> http://localhost:3000/candidate/resetpassword/${token}`,
      candidate.email
    );
    res.json({
      msg: "Token Sent TO your email.",
    });
  },

  resetPasswordByToken: async (req, res) => {
  
      let { token } = req.params;
      let { email, password } = req.body;
  
      if (!token) {
        res.send("Please Provide token in order to change your password");
        return;
      }
      
      let candidate = await getCandidatesByEmail(connection, email);
      let secret = "Hello" + candidate.password;
  
      jwt.verify(token, secret, async (err, data) => {
        try {
          if (err) {
            res.send(err);
            return;
          }
         
          let hashPassword = await hash(password, 10);
          let check=await schemaReset.validateAsync(req.body)
          
      
          connection.query(
            `update candidates set password = '${hashPassword}' where email = '${email}'`,
            async(err, data) => {
       
              if (err) {
              
                res.send(err);
                return;
              }
           
              res.json({
                msg: "Successfully Updated the password",
              });
              console.log(5);
            }
          );
        } catch (error) {
          res.send(error)
        }
       
      });
    
  },

  allJobs: (req, res) => {
    let pageNumber=req.query.page
    let sizeNumber=req.query.size
    let {page,size}=pagination(pageNumber,sizeNumber)
    connection.query(`select * from jobs limit ${size} offset ${page*size}` , (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json({ msg: result });
      }
    });
  },
  applyJobs: async (req, res) => {
    connection.query(
      `Select * from jobs where job_id = ?`,
      [req.params.id],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          connection.query(
            "Select * from candidates where email = ?",
            [req.user.values[0]],
            (err, id) => {
              if (err) {
                res.send(err);
              } else {
                connection.query(
                  "Insert into appliedjobs values(default,?,?,?)",
                  [result[0].recruiter_id, req.params.id, id[0].candidate_id],
                  async(err, data) => {
                    if (err) {
                      res.send(err);
                    } else {
                       let recruiter=await getRecruitersById(connection,result[0].recruiter_id)
                       mail("Thanks For Applying","You've Succesfully Applied",`Dear ${id[0].firstName} ${id[0].lastName} has Sucessfully applied`,[id[0].email,recruiter.email])
                      res.json({
                        msg: "Sucessfully Applied",
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  },
  appliedjobs: (req, res) => {
    let pageNumber=req.query.page
    let sizeNumber=req.query.size
    let {page,size}=pagination(pageNumber,sizeNumber)
    connection.query(
      `Select * from candidates where email = ? limit ${size} offset ${page*size}` ,
      [req.user.values[0]],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          connection.query(
            "Select cd.firstName,cd.lastName,j.title,j.description from appliedjobs ap inner join candidates cd on cd.candidate_id=ap.candidate_id inner join jobs j on j.job_id=ap.job_id  where ap.candidate_id =?",
            [result[0].candidate_id],
            (err, data) => {
              if (err) {
                res.send(err);
              } else {
                res.json({
                  msg: data,
                });
              }
            }
          );
        }
      }
    );
  },
  welcome: async (req, res) => {
    res.send("hello");
  },
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          msg: "Sucessfully Logout",
        });
      }
    });
  },
  hello:(req,res)=>{
    res.send("hello")
  }
};
