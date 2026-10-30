
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const setSessionCookie = (res, payload) => {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "30d"
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
    });
};

// Register
export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please provide all required fields"
        });
    }

    const trimmedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
        email: trimmedEmail
    });

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const user = await User.create({
        name,
        email: trimmedEmail,
        password
    });

    setSessionCookie(res, {
        userId: user._id.toString(),
        email: user.email
    });

    res.status(201).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

// Login
export async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Invalid email or password!"
        });
    }

    const user = await User.findOne({
        email: email.toLowerCase().trim()
    }).select("+password");

    if (!user) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    setSessionCookie(res, {
        userId: user._id.toString(),
        email: user.email
    });

    res.status(200).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

// Logout
export async function logoutUser(_req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });

    res.json({ success: true });
}

// Get current user
export async function getUser(req, res) {
    const user = await User.findById(
        req.user.userId
    ).select("-password");

    if (!user) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    res.json({ user });
}
