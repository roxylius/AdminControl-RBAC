const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

// Get the Schema object from Mongoose
const Schema = mongoose.Schema;

// Create a schema to define the structure of the role data
const RoleSchema = new Schema({
    name: {
        type:String,
        unique:true
    },
    description: String,
    permissions: [String]
});

//find or create role
RoleSchema.plugin(findOrCreate);

// Create a model using the user schema
const Role = new mongoose.model('Role', RoleSchema);

module.exports = Role;
