const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    quantity: Number,
    category: {
        type: String
    },
    imageID: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    imagePath: String
});

const Equipment = mongoose.model('Equipments', equipmentSchema);

module.exports = Equipment;
