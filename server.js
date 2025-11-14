import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import db from './config/DB.js';
import SignUpRouter from './Router/SignUpRouter.js'
import otpRouter from './Router/otpRouter.js'
import forgotRouter from './Router/ForgotRouter.js'
import getData from './Router/route.js'
const app=express();
app.use(express.json());

db();


app.use('/api/v1/login',otpRouter);
app.use('/api/v1/SignUp',SignUpRouter);
app.use('/api/v1/forgot',forgotRouter);
app.use('/api/v1/user',getData);

 app.get('/',(req,res)=>{

    res.json("hello");

 })

 const PORT=process.env.PORT || 5000                                                                                                                                                                                                                                                                  

app.listen(PORT,()=>{
      console.log(`server running is succesfully at on ${PORT} port`);
})