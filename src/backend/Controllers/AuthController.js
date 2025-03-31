const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const AdminModel = require("../Models/AdminModel"); 


const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword} = req.body;

        // Check if all fields are filled
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Validate that password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const userModel = new UserModel({ firstName,lastName, email, password,confirmPassword });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                firstName: user.firstName,
                lastName: user.lastName
            })
    } catch (err) {
        res.status(500)
        console.error('Error in login:', err)
            .json({
                message: "Internal server errror",
                success: false
            });
    }
}



const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received login request for email:', email);

        const errorMsg = 'Email or password is wrong';

        // Find admin by email
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            console.log('Admin not found with this email:', email);
            return res.status(403).json({ message: errorMsg, success: false });
        }

        // Compare passwords
        const isPassEqual = await bcrypt.compare(password, admin.password);
        console.log('Password comparison result:', isPassEqual);

        if (!isPassEqual) {
            console.log("Password mismatch");
            return res.status(403).json({ message: errorMsg, success: false });
        }

        // ✅ Generate JWT Token (Includes role & id)
        const jwtToken = jwt.sign(
            { id: admin._id, email: admin.email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log("Admin authenticated successfully, JWT Token generated:", jwtToken);

        // ✅ Send token as an HTTP-only cookie (More Secure)
        res.cookie("token", jwtToken, {
            httpOnly: true,  // Prevents access from JavaScript
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // ✅ Send response (excluding token from body for security)
        return res.status(200).json({
            message: "Admin Login Success",
            success: true,
            email: admin.email
        });

    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    signup,
    login,
    adminLogin
}