
const LocalStrategy=require("passport-local")
const connection=require("../connection")
const bcrypt=require("bcrypt")
const { getCandidatesByEmail, getRecruitersByEmail } = require("../func")

exports.PassportInitialize=(passport)=>{
passport.use(new LocalStrategy ({usernameField:"email",passwordField:"password"},async function(email,password,done){
try {
let user=null
let candidate = await getCandidatesByEmail(connection,email)

let recruiter=await getRecruitersByEmail(connection,email)

if(candidate){
    user=candidate
}else {
    user=recruiter
 
}
if(!user){
    done("Email Address Not Exist",false)
}

let hashPassword=await bcrypt.compare(password,user.password)

if(!hashPassword){
    done("Password is Incorrect",false)
}
done(null,user)





   
} catch (error) {
    done(error,false)
}

}))

passport.serializeUser((user, done) => {
 
done(null, user.email);
  });
  passport.deserializeUser(async (email, done) => {
    try {
    
      let candidate=connection.query("Select * from candidates where email = ?",[email])
      if(!candidate){
        return done("Email Address Doesn't Exist",false)
      }
      done(null, candidate);
    } catch (error) {
      done(error, false);
    }
  });

}

exports.isAuthenticatedCandidate = async (req, res, next) => {
    if (!req.user) {
      return res.send("You're not logged in");
    }
  
    let candidate = req.user.values[0];
   
   connection.query("Select * from candidates where email = ?",[candidate],(err,result)=>{
    if(err){
        res
        .status(404)
        .send(
          `${req.user.dataValues.firstName} ${req.user.dataValues.lastName} is not a Candidate`
        );

    }else{
return next()
    }
   })
    
   
  };


  exports.isAuthenticatedRecruiter = async (req, res, next) => {
    if (!req.user) {
      return res.send("You're not logged in");
    }
  
    let recruiter = req.user.values[0];
   
   connection.query("Select * from recruiters where email = ?",[recruiter],(err,result)=>{
    if(err){
        res
        .status(404)
        .send(
          `${req.user.dataValues.firstName} ${req.user.dataValues.lastName} is not a Recruiter`
        );

    }else{
return next()
    }
   })
    
   
  };
    
  
