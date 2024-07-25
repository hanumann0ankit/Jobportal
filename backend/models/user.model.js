import mongoose from "mongoose";

const userSchema =new mongoose.Schema(
   {
    fullname:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    phoneNumeber:
    {
        type:Number,
        required: true
    },
    password:
    {
        type: String,
        required: true,
    },
    role:
    {
        type: String,
        required: true,
        enum: ["student", "recruiter"]
    },
    profile:
    {
      bio:{type:String},
      skills:[{type:String}],
      resume:{type:String}  , //url to the resume file
      resumeOriginalName:{type:String},
      company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
      profilePhoto:
      {
        type: String,
        default: "default_profile_photo.jpg"
      }
    }
},{timestamps:true}
)

export const User=mongoose.model("User",userSchema);