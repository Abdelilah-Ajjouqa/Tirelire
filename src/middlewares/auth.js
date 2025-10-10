import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if(!token){
            return res.status(401).json({
                message: "cannot access. Token undefined"
            });
        }
        
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userId).select('-password');
        if(!user){
            return res.status(401).json({
                error: "user not found"
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: `erro: ${error.message}`
        })
    }
}