const express = require('express');
const passport = require('passport');

const userRouter = express.Router();

//import user to search the collection User in MongoDB
const User = require('../../schema/user');

//import log to record and timestamp each action
const Log = require("../../schema/log");

// //handled by passport-local-mongoose module
passport.use(User.createStrategy({ usernameField: 'email' })); //verify credentials from DB

//it handle the post request of user page
userRouter.get("/", (req, res) => {
    //check if user is Authenticated 
    if (req.isAuthenticated())
        res.status(200).json(req.user);
    else
        res.status(401).json({ message: 'Authentication Error!' });
});

//return all the user
userRouter.get("/all",async (req,res)=>{

    try{
    //list of all user
    const users = await User.find();
    console.log(users);

    res.status(200).json(users);

    }catch (error){
        res.status(500).json({message:"There was error fetching users",error});
    }
});


//add new user to data from admin portal
userRouter.post("/add", async (req, res) => {
    try {
        const { name, email, password, role, permissions, user } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user object
        const newUser = new User({
            name,
            email,
            role,
            permissions,
            provider: "admin-panel"
        });

        // Register the user and hash the password
        User.register(newUser, password, async (err, registeredUser) => {
            if (err) {
                res.status(500).json({ message: "Error registering user", error: err });
            } else {
                // Save log of adding user
                const newLog = new Log({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    action: `added new user: ${name}`
                });
                await newLog.save();

                res.status(201).json({ message: "User created successfully", user: registeredUser });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding user", error });
    }
});

userRouter.delete("/delete", async (req, res) => {
    try {
        //retrieve input passed by client application
        const { name,email, user } = req.body;

        const foundUser = await User.findOneAndDelete({ email });

        if (!foundUser) {
            return res.status(404).json({ message: "Role not found" });
        }

        //save log of delete role
        const newLog = new Log({
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            action: `deleted User: ${name} and ${email}`
        });
        await newLog.save();

        res.status(200).json({ message: `User '${name}' deleted successfully`, user: foundUser });
    } catch (error) {
        res.status(500).json({ message: "Error deleting User", error });
    }
});

userRouter.put("/edit",async(req,res)=>{
    try{
        const {name,email,role,permissions,user} = req.body;

        //if the user is already present then update the user
        const updatedUser = await User.findOneAndUpdate(
            {email},
            {name,role,permissions},
            { new: true, runValidators: true } // Return the updated document and run validations
        );

        if(!updatedUser)
            res.status(404).json({message:"user not found"});

         //save log of update role
         const newLog = new Log({
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            action: `updated User: ${name} and ${email}`
        });

        await newLog.save();

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }catch(error){
        res.status(500).json({ message: "User updated Failed!", error });
    }
})



//export the userRouter module to app.js which handle all route requests
module.exports = userRouter;


