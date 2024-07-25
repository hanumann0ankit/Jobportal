import { User } from "../models/user.model";
import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register =async (req,res)=>
{
    try {
      const { fullname, email, phoneNumber, password, role } = req.body;
      if (!fullname || !email || !phoneNumber || !password || !role) {
        return res.status(400).json({
          msg: "All fields are required",
          success: false,
        });
      }
      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          msg: "Email already exists",
          success: false,
        });
      }

      const hashedPassword = await bcrpyt.hash(password, 10);

      await User.create({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
      });
    } catch (error) 
    {

    }
}

export const login=async (req, res)=>
{
    try{
        const { email, password ,role} = req.body;
        if(!email || !password || !role)
        {
            return res.status(400).json({
                msg: "All fields are required",
                success: false,
            });
        };

        const user = await User.findOne({ email});
        if(!user)
        {
            return res.status(400).json({
                msg: "Invalid credentials",
                success: false,
            });
        }
        const isPasswordMatch=await bcrpyt.compare(password,user.password);

        if(!isPasswordMatch)
        {
            return res.status(400).json({
                msg: "Invalid credentials",
                success: false,
            });
        }

        if(role !== user.role)
        {
            return res.status(400).json({
                msg: "Account doesn't exist with this route",
                success: false,
            });
        }

        const tokenData={
            userId:user._id,
        };

        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

        return res.status(200).cookie(
            "token",token,
            {maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
                message:'Welcome back ${user.fullname}',
                success:true
            })
            
        

    }
    catch(error)
    {}
}