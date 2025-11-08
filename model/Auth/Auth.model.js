import mongoose from "mongoose";


const SignUpSchema=new mongoose.Schema({

  MobNo:{
   type: String,
  required: true,
  trim: true,

  minlength: 10,
  maxlength: 10
  },

  email:{
    type:String,
    unique:true,
    trim:true,
    require:true
  },
  password:{
    type:String,
     trim:true,
     require:true
  }



})

const User= mongoose.model('Register',SignUpSchema);
export default User