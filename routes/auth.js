const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config({path:__dirname+'../.env'});
// import som from '../'
const jwt = require('jsonwebtoken');
const JWT_SECRET  = process.env.JWT_SECRET;
const fetchuser = require('../middleware/fetchuser');
//Route:1 create a user using : post  "/api/auth/createuser". no login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 character').isLength({ min: 5 }),

], async (req, res) => {
    // console.log(req.body.name);
    let success = false;
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with email id already exists" })
        }
        const salt = await bcrypt.genSalt(saltRounds);
        const secPass = await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user : {
                id : user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success =true;
        res.json({success,authToken})
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Some error ocuured");
    }



    // .then(user => res.json(user))
    // .catch(err=> {console.log(err)
    // res.json({error :"Please enter a unique value for email",message :err.message})})

    
})
//Route:2 Login a user using : post  "/api/auth/login". no login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {
    // console.log(req.body.name);
    const errors = validationResult(req);
    let success = false;
    // console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ success,error: "Please try to login with correct credentials" })
        }
        const passwordCompare =await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            return res.status(400).json({ success,error: "Please try to login with correct credentials" })
        }
        const data = {
            user : {
                id : user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken})
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Some error ocuured");
    }
}) 

//Route:3 Getting user detials using : post  "/api/auth/getuser".  login required
router.post('/getuser',fetchuser,async (req, res) => {
    
    try {
        userID = req.user.id;
        const user = await User.findById(userID).select("-password")
        res.send(user);
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Some error ocuured");
    }
}) 


module.exports = router