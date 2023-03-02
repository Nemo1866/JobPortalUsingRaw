let jwt=require("jsonwebtoken")
let connection=require("../connection")
const { connect } = require("../connection")
let isAuthenticatedCanidate=(req,res,next)=>{
    let token =req.headers.authorization.split(' ')[1]
    if(!token){
        res.send("Please Enter a token to get the access")
    }
    let decode=jwt.verify(token,process.env.SECRET)
    let exists=connection.query("Select email from candidates where email = ?",[req.dataValues.email])
    if(exists==decode){
        return next()
    }else{
        res.send("Invalid Token")
    }
}

module.exports={isAuthenticatedCanidate}