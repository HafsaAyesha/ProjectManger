const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper to sign token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_key", {
        expiresIn: '7d'
    });
};

//SIGN UP
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, username, password: hashedPassword });
        await user.save();

        // Generate Token
        const token = signToken(user._id);

        // Return user + token
        const { password: pw, ...others } = user._doc;
        res.status(200).json({ user: others, token, message: "Registration Successful!" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

//SIGN IN / LOGIN
router.post("/signin", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ message: "Please Sign Up First" });
        }

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password is not correct" });
        }

        const { password, ...others } = user._doc;

        // Generate Token
        const token = signToken(user._id);

        res.status(200).json({ others, token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server Error during login" });
    }
});

module.exports = router;