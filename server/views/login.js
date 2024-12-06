const express = require('express');
const passport = require('passport');

//handles login routes
const loginRouter = express.Router();

// //import user to search the collection User in MongoDB
const User = require('../schema/user');

// //handled by passport-local-mongoose module
passport.use(User.createStrategy({ usernameField: 'email' })); //verify credentials from DB

// Handle the POST request for login
loginRouter.post('/', (req, res, next) => {
    //authenticates the user in DB and conditionally generates response
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        // Error during authentication (e.g., database error)
        return res.status(500).json({ message: 'An error occurred during authentication.' });
      }

      if (!user) {
        // Authentication failed (invalid credentials)
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // Establish a login session
      req.logIn(user, async (err) => {
        if (err) {
          // Error during login
          return res.status(500).json({ message: 'An error occurred during login.' });
        }
        try {
          // Find the user by name
          const foundUser = await User.findOne({ name: user.name }).exec();
          if (!foundUser) {
            return res.status(404).json({ message: 'User not found.' });
          }
          // Successful login
          // Return the user's details, including their role
          return res.status(200).json({
            message: 'Login successful.',
            user: {
              id: foundUser._id,
              email: foundUser.email,
              name: foundUser.name,
              role: foundUser.role,
            },
          });
        } catch (error) {
          return res.status(500).json({ message: 'An error occurred while retrieving user details.' });
        }
      });
    })(req, res, next);
});

//export the loginRouter module to app.js which handle all route requests
module.exports = loginRouter;


