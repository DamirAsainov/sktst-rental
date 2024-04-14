const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageID: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    imagePath: String
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
