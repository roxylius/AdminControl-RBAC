const express = require("express");

//handle Role management
const roleRouter = express.Router();

//import role to search the role in collection Role in mongodb
const Role = require("../../schema/role");

//import log to record and timestamp each action
const Log = require("../../schema/log");

//returns all the roles created
roleRouter.get("/", async (req, res) => {
    try {
        const roles = await Role.find(); // Fetch all roles from the database
        res.status(200).json(roles); // Return roles as JSON response
    } catch (error) {
        res.status(500).json({ message: "Error fetching roles", error });
    }
});

roleRouter.post("/add", async (req, res) => {
    try {
        //role data send from client
        const { name, description, permissions, user } = req.body;
        console.log({...req.body});
        

        // Check if the role already exists
        const existingRole = await Role.findOne({ name });
        console.log(existingRole);
        
        if (existingRole) {
            return res.status(400).json({ message: "Role already exists" });
        }

        // Create a new role
        const newRole = new Role({
            name,
            description,
            permissions
        });

        // Save the role to the database
        await newRole.save();

        //save log of add role
        const newLog = new Log({
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            action: `added new role: ${name}`
        });
        await newLog.save();


        res.status(201).json({ message: "Role created successfully", newRole });
    } catch (error) {
        res.status(500).json({ message: "Error adding role", error });
    }
});

roleRouter.delete("/delete", async (req, res) => {
    try {
        //retrieve input passed by client application
        const { name, user } = req.body;

        const role = await Role.findOneAndDelete({ name });

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        //save log of delete role
        const newLog = new Log({
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            action: `deleted role: ${name}`
        });
        await newLog.save();

        res.status(200).json({ message: `Role '${name}' deleted successfully`, role });
    } catch (error) {
        res.status(500).json({ message: "Error deleting role", error });
    }
});


roleRouter.put("/edit", async (req, res) => {
    try {
        const { name, description, permissions, user } = req.body;

        // Find the role and update it with new data
        const updatedRole = await Role.findOneAndUpdate(
            { name },
            { description, permissions },
            { new: true, runValidators: true } // Return the updated document and run validations
        );

        if (!updatedRole) {
            return res.status(404).json({ message: "Role not found" });
        }

        //save log of update role
        const newLog = new Log({
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            action: `update role: ${name}`
        });
        await newLog.save();

        res.status(200).json({ message: "Role updated successfully", role: updatedRole });
    } catch (error) {
        res.status(500).json({ message: "Error updating role", error });
    }
});


//export the module to app.js which all api requests to manage roles
module.exports = roleRouter;