const { Schema, model} = require('mongoose');

const Order = new Schema({
    userID: {type: String, require: true},
    name: {type: String, require: true},
    phoneNumber: {type: String, require: true},
    equips: [{type: String,
        require: true}],
    start: {type: String},
    end: {type:String},
    totalPrice: {type: String}
})

module.exports = model('Order', Order)