import SignUpSchemaModel from "../../../model/Auth/Auth.model.js";
import bcrypt from "bcryptjs";
const SignUp=async (req,res)=>{

  try{

      
     const {MobNo, email, password}=req.body

     if(!MobNo || !email || !password)
     {
        return res.status(400).json({message:"required All field"});
     }

     const CheckUserExist=await SignUpSchemaModel.findOne({email});
     
     if(CheckUserExist)
     {
        return res.status(400).json({message:"User Already Exist "});
     }
  
   const hashPass=await bcrypt.hash(password,10);
   const data= await SignUpSchemaModel.create (
    {
         MobNo,
         email,
         password:hashPass
    })
   
  res.status(201).json({ message: data });

  }catch(error)
  {
    
    res.status(500).json({Error: error || "Internal Server Error During the Registeration" });
     
  }


}

export default SignUp

