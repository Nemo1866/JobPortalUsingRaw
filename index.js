require("./connection")
const express=require("express")
const router = require("./routes/router")
const app=express()
const session=require("express-session")
const passport=require("passport")
const { PassportInitialize } = require("./passport/passportConfig.")
const swaggerDocs=require("swagger-jsdoc")
const swaggerUI=require("swagger-ui-express")
const swaggerSpec = require("./SwaggerConfig")




app.use(express.json())

app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec))



PassportInitialize(passport)
app.use(session({
    secret:'secret',
    saveUninitialized:false,
    resave:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use("/",router)


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})