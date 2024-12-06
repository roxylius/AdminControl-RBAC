const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

// Get the Schema object from Mongoose
const Schema = mongoose.Schema;

// Create a schema to define the structure of the permission data
const permissionSchema = new Schema({
    name: {
        type:String,
        unique: true
    },
    description: String
});

// find or create permission
permissionSchema.plugin(findOrCreate);

// Create a model using the permission schema
const Permission = new mongoose.model('Permission', permissionSchema);

module.exports = Permission;
