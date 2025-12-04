import { client } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// -----------------------------------------
// Generate Tokens (simple key, no env)
// -----------------------------------------
const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, "abc123", { expiresIn: "1d" });
    const refreshToken = jwt.sign({ userId }, "abc123", { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

// -----------------------------------------
// FIXED REDIS SET FUNCTION (NO ERROR)
// -----------------------------------------
const storeRefreshToken = async (userId, refreshToken) => {
    await client.set(
        `refreshToken:${userId}`,
        refreshToken,
        "EX",
        7 * 24 * 60 * 60
    );
};

// -----------------------------------------
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

// -----------------------------------------
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User exists" });

        const user = await User.create({ name, email, password });

        const { accessToken, refreshToken } = generateToken(user._id);

        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            message: "User created",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// -----------------------------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid login" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid login" });

        const { accessToken, refreshToken } = generateToken(user._id);

        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// -----------------------------------------
export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(400).json({ message: "No token" });

        const decoded = jwt.verify(token, "abc123");
        await client.del(`refreshToken:${decoded.userId}`);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
 
export const refreshToken = async (req, res) => {
    try {
        const refreshTken=req.cookie.refreshTken;
        if(!refreshTken) return res.status(400).json({message:"No token found"});
        
        const decoded=jwt.verify(refreshTken,"abc123"); 
        const storedToken=await client.get(`refreshToken:${decoded.userId}`);
        if(refreshTken!==storedToken) return res.status(400).json({message:"Invalid token"});

        const accessToken=jwt.sign({userId:decoded.userId},"abc123",{expiresIn:"1d"});
        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:24*60*60*1000,
        });

        res.status(200).json({message:"Access token refreshed"});       
    } catch (error) {
        res.status(500).json({message:"Server error"});
    }
}

export const getProfile=async(req,res)=>{
    try {


    }
    catch(error){

    }


}
