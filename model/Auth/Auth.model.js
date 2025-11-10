import mongoose from "mongoose";

const SignUpSchema = new mongoose.Schema({
  MobNo: {
    type: String,
    required: true,
    unique:true,
    trim: true,
    minlength: 10,
    maxlength: 10,
  },

  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  
  },

  password: {
    type: String,
    trim: true,
    required: true,
  },

  
  profileImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  dob: {
    type: Date,
    required:true
  },


  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required:true
  },

 
  interests: {
    type: [String],
    default: [],
  },


  gallery: [
    {
      url: { type: String},
      public_id: { type: String },
    },
  ],

 
},{

   timestamps:true
});

const User = mongoose.model("Register", SignUpSchema);
export default User;
