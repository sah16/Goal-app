const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req , res) =>{
    const {name, email, password } = req.body
    
    if(!name || !email || !password){
        res.status(400)
        throw new Error ('Please add all fields')
    }
    //check if user exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User already Exists')
    }

    // Hash Password

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password , salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    }
    else {
        res.status(400)
        throw new Error('Invalid User Data')
    }

    res.json({
        messsage: 'Register User'
    })
})

// @desc Authenticate a User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req , res) =>{
    res.json({
        messsage: 'Login User'
    })
})


// @desc Get User data
// @route Get /api/users/me
// @access Public
const getMe = asyncHandler(async (req , res) =>{
    res.json({
        messsage: 'User data display'
    })
}
)
module.exports = {
    registerUser,
    loginUser,
    getMe,
}