const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;


// ROUTE 1: Create a user using: POST "/api/auth/createuser" . No Login Required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be of atleast 5 characters').isLength({ min: 5})
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({success, error: errors.array() });
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({success, error: "Sorry, a user with this email already exists" });
        const salt = await bcrypt.genSalt();
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success, error: "Internal Server Error" });
    }
})

// ROUTE 2: Authenticate a user using POST: "api/auth/login". No Login Required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', "Password can't be blank").exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({success, error: errors.array() });
    const { email, password } = req.body;
    try {
        let user = await User.findOne({email});
        if (!user) return res.status(400).json({ error: "Please try to login with correct credentials"});
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) return res.status(400).json({success, error: "Please try to login with correct credentials"});
        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({success, error: "Internal Server Error"});
    }
})

// ROUTE 3: Get a logged in user Details using POST: "api/auth/getUser". Login Required
router.post('/getuser', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }catch {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;