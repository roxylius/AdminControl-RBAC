const express = require("express");

//handle Role management
const permissionRouter = express.Router();

//import permission to search the permission in collection Role in mongodb
const Permission = require("../../schema/permission");

//import log to record and timestamp each action
const Log = require("../../schema/log");

//returns all the permission created
permissionRouter.get("/", async (req, res) => {
    try {
        const permissions = await Permission.find(); // Fetch all permissions from the database
        res.status(200).json(permissions); // Return permissions as JSON response
    } catch (error) {
        res.status(500).json({ message: "Error fetching permissions", error });
    }
});

permissionRouter.post("/add", async (req, res) => {
    try {
        //permission data send from client
        const { name, description, user } = req.body;


        // Check if the permission already exists
        const existingPerm = await Permission.findOne({ name });
        if (existingPerm) {
            return res.status(400).json({ message: "Perm already exists" });
        }

        // Create a new permission
        const newPerm = new Permission({
            name,
            description
        });

        // Save the permission to the database
        await newPerm.save();

        //save log of add role
        const newLog = new Log({
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            action: `added new permission: ${name}`
        });
        await newLog.save();

        res.status(201).json({ message: "Permission created successfully", newPerm });
    } catch (error) {
        res.status(500).json({ message: "Error adding permission", error });
    }
});

permissionRouter.delete("/delete", async (req, res) => {
    try {
        //retrieve input passed by client application
        const { name, user } = req.body;

        const permission = await Permission.findOneAndDelete({ name });

        if (!permission) {
            return res.status(404).json({ message: "permission not found" });
        }

        //save log of add role
        const newLog = new Log({
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            action: `delete new permission: ${name}`
        });
        await newLog.save();

        res.status(200).json({ message: `Perm '${name}' deleted successfully`, name: permission });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Perm", error });
    }
});

permissionRouter.put("/edit", async (req, res) => {
    try {
        const { name, description, user } = req.body;

        // Find the permission and update it with new data
        const updatedPerm = await Permission.findOneAndUpdate(
            { name },
            { description },
            { new: true, runValidators: true } // Return the updated document and run validations
        );

        if (!updatedPerm) {
            return res.status(404).json({ message: "Permission not found" });
        }

        //save log of add role
        const newLog = new Log({
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            action: `edit permission: ${name}`
        });
        await newLog.save();

        res.status(200).json({ message: "Perm updated successfully", name: updatedPerm });
    } catch (error) {
        res.status(500).json({ message: "Error updating perm", error });
    }
});


//export the module to app.js which all api requests to manage permissions
module.exports = permissionRouter;