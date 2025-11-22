const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

//SIGN UP
router.post("/register", async (req, res) => {
    try {
        const {email, username, password} = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Fix: Use async hash instead of hashSync
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({email, username, password: hashedPassword});
        await user.save();
        
        res.status(200).json({ message: "Registration Successful!", user });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

//SIGN IN / LOGIN
router.post("/signin", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(400).json({message: "Please Sign Up First"}); // Added return
        }

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Password is not correct"}); // Added return
        }

        const {password, ...others} = user._doc;
        res.status(200).json({others});
    } catch (error){
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server Error during login" });
    }
});

module.exports = router;