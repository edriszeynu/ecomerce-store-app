import Jwt from "jsonwebtoken"; 
import User from "../models/user.model.js";
export const protectRoute=async(req,res,next)=>{
    try{
    const accsessToken=req.cookies.accessToken;
    if(!accsessToken){
        return res.status(401).json({message:"Unauthorized"})
    }
    const decoded=Jwt.verify(accsessToken,"abc123");

    const user=await User.findById(decoded.id).select("-password");
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }
    req.user=user;
    next(); 
    
}
    catch(error){

        console.log("error in the middlwware",error);
        return res.status(401).json({message:"Unauthorized"});
    }


}

export const adminRoute=(req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next();
    }
    else{
        return res.status(403).json({message:"Forbidden,admin only"})
    }
}