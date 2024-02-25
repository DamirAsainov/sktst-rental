const { Schema, model} = require('mongoose');

const User = new Schema({
    username: {type: String, unique: true, require: true},
    email: {type: String, unique: true},
    name: {type: String},
    password: {type: String, require: true},
    roles: [{type: String, ref: 'Role'}]
})

module.exports = model('User', User)