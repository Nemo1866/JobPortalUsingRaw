const {google}=require("googleapis")
const nodemailer=require("nodemailer")
require("dotenv").config()

const oAuthGoogleClient=new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI)
oAuthGoogleClient.setCredentials({refresh_token:process.env.REFRESH_TOKEN})

function mail(title,subject,body,email){
    let accessToken= oAuthGoogleClient.getAccessToken()

    let transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
type:"OAuth2",
user:process.env.USER,
clientId:process.env.CLIENT_ID,
clientSecret:process.env.CLIENT_SECRET,
refreshToken:process.env.REFRESH_TOKEN,
accessToken:accessToken
        }
    })
    let mailOptions={
        from:`${title}  <${process.env.USER}>`,
        to:email,
        subject:subject,
       
        text:"Checking ",
        html:body
    }
    transport.sendMail(mailOptions,(err)=>{
        if(err){
            res.json({ msg:"Some Error Occured"})
        }else{
            res.json({
                msg:"Sucessfully Sent to your email"
            })
        }
    })
}
module.exports={mail}