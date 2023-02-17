const asyncHandler = require('express-async-handler')

const Goal  = require('../model/goalmodel')
const  User = require('../model/userModel')


// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) =>{
    const goals = await Goal.find({user: req.user.id})

    res.status(200).json(goals)
})


// @desc set goals
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) =>{
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.body.id, 
    })

    res.status(200).json(goal)
})


// @desc Update goal
// @route PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) =>{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)
    //checking user
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }

    if(goal.user.toString() !==user.id){
        res.status(401)
        throw new Error('User Not Authorized')
    }

    const updatedGoal = await Goal.findByIgAndUpdate(req.params.id , req.body, {
      new:true,  
    })
    res.status(200).json(updatedGoal)
})



// @desc Delete goals
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) =>{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)
    //checking user
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }

    if(goal.user.toString() !==user.id){
        res.status(401)
        throw new Error('User Not Authorized')
    }
    
    await Goal.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
}