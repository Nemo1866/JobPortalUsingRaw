
const LocalStrategy=require("passport-local")
const connection=require("../connection")
const bcrypt=require("bcrypt")
const { getCandidatesByEmail, getRecruitersByEmail, getAmdinByEmail } = require("../func")

exports.PassportInitialize=(passport)=>{
passport.use(new LocalStrategy ({usernameField:"email",passwordField:"password"},async function(email,password,done){
try {
let user=null
let candidate = await getCandidatesByEmail(connection,email)

let recruiter=await getRecruitersByEmail(connection,email)
let admin =await getAmdinByEmail(connection,email)

if(candidate){
    user=candidate
}else if(recruiter){
    user=recruiter
 
}else{
  user=admin
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
  
    let email = req.user.values[0];
  
   let candidate=await getCandidatesByEmail(connection,email)
   if(!candidate){
    res.send("You're not a candidate.")
   }else{
    next()
   }
  
   
  };


  exports.isAuthenticatedRecruiter = async (req, res, next) => {
    if (!req.user) {
      return res.send("You're not logged in");
    }
  
    let email= req.user.values[0];
    let recruiter=await getRecruitersByEmail(connection,email)

    if(!recruiter){
      res.send("You're Not a recruiter")
    }else{
      next()
    }
 
    
   
  };


  
  exports.isAuthenticatedAdmin = async (req, res, next) => {
    if (!req.user) {
      return res.send("You're not logged in");
    }
  
    let email = req.user.values[0];
   
   let admin=await getAmdinByEmail(connection,email)

   if(!admin){
    res.send("You're not a admin")
   }else{
    next()
   } 
   };
    
  
