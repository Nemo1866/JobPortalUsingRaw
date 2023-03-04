require("dotenv").config()
const mysql2=require("mysql2")

const mySqlConnection=mysql2.createConnection({
    host:process.env.HOST,
    user:"root",
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})



mySqlConnection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("DB is Connected");
    }
})
module.exports=mySqlConnection