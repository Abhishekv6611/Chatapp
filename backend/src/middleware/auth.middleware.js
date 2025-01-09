import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute=async(req,res,next)=>{
    try {
      const token=req.cookies.jwt

      if(!token){
        return res.status(401).json({msg:'Please login to access this page'})
      }
      const decode =jwt.verify(token,process.env.JWT_SECRET)
      if(!decode){
        return res.status(401).json({msg:'Token is invalid, please login'})
      }
      const user=await User.findById(decode.userId).select("-password")
      if(!user){
        return res.status(404).json({msg:'User does not exist'})
      }
      req.user=user
      next()
    } catch (error) {
      console.log("Error is ProtectedRoute",error.message);
      return res.status(500).json({msg:'Server error'})     
    }
}