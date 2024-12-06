const express = require("express");

//handle Role management
const logRouter = express.Router();

//import log to search the log in collection Role in mongodb
const Log = require("../../schema/log");

//returns all the log created
logRouter.get("/", async (req, res) => {
    try {
        const logs = await Log.find(); // Fetch all logs from the database
        res.status(200).json(logs); // Return logs as JSON response
    } catch (error) {
        res.status(500).json({ message: "Error fetching logs", error });
    }
});

logRouter.post("/add", async (req, res) => {
    try {
        //log data send from client
        const { name, email, role, timestamp, action } = req.body;

        // Create a new log
        const newLog = new Log({
            name,
            email,
            role,
            timestamp,
            action
        });

        // Save the log to the database
        await newLog.save();

        res.status(201).json({ message: "log created successfully", log : newLog });
    } catch (error) {
        res.status(500).json({ message: "Error adding log", error });
    }
});

// logRouter.delete("/delete", async (req, res) => {
//     try {
//         //retrieve input passed by client application
//         const { roleName } = req.body;

//         const role = await Log.findOneAndDelete({ role: roleName });

//         if (!role) {
//             return res.status(404).json({ message: "Role not found" });
//         }

//         res.status(200).json({ message: `Role '${roleName}' deleted successfully`, role });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting role", error });
//     }
// });

// logRouter.put("/edit", async (req, res) => {
//     try {
//       const { roleName, description, logs } = req.body;
  
//       // Find the role and update it with new data
//       const updatedRole = await Role.findOneAndUpdate(
//         { role: roleName },
//         { description, logs },
//         { new: true, runValidators: true } // Return the updated document and run validations
//       );
  
//       if (!updatedRole) {
//         return res.status(404).json({ message: "Role not found" });
//       }
  
//       res.status(200).json({ message: "Role updated successfully", role: updatedRole });
//     } catch (error) {
//       res.status(500).json({ message: "Error updating role", error });
//     }
//   });
  

//export the module to app.js which all api requests to manage logs
module.exports = logRouter;