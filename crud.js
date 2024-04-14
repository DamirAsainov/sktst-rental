const Category = require('./models/Category');
const Image = require('./models/Image');
const Equipment = require('./models/Equipment');
const User = require('./models/User')
const fs = require('fs');


const getAllCategories = async () => {
    try {
        return await Category.find().populate('imageID');
    } catch (error) {
        console.error("Get All Categories Error:", error);
        return null;
    }
}
const getAllCategoriesWithImg = async () => {
    try {
        const categories = await Category.find();
        for (const category of categories) {
            category.image = await Image.findById(category.imageID);
        }
        return categories;
    } catch (error) {
        console.error("Get All Categories Error:", error);
        return null;
    }
}
async function getAllCategoriesWithEquip() {
    try {
        const categories = await Category.find();
        for (const category of categories) {
            category.equip = await Equipment.find({category: (await category).title});
        }
        return categories;
    } catch (error) {
        console.error("Error getting all categories with equipments", error);
        return null;
    }
}
async function addEquip(req, res){
    try {
        const imageBuffer = fs.readFileSync(req.file.path);
        const image = new Image({
            filename: req.file.filename,
            path: req.file.path,
            data: imageBuffer
        });
        const savedImage = await image.save();

        console.log(`File uploaded with ID: ${savedImage._id}`);
        console.log(req.body.productName);

        const equipment = new Equipment({
            productName: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            imageID: savedImage._id,
            imagePath: "image/" + savedImage.filename
        });
        await equipment.save();

        res.send('File uploaded successfully!');

        deleteImage(req.file.path)
    } catch (error) {
        console.error('Error uploading file', error);
        res.status(500).send('Error uploading file.');
    }
}
async function addCategory(req,res){
    try{
        const imageBuffer = fs.readFileSync(req.file.path);
        const image = new Image({
            filename: req.file.filename,
            path: req.file.path,
            data: imageBuffer
        });
        const savedImage = await image.save();

        const category= new Category({
            title: req.body.categoryTitle,
            imageID: savedImage._id,
            imagePath: "image/"+ savedImage.filename
        });
        const savedCategory = await category.save();
        console.log(`Category add with ID: ${savedCategory._id}`);
        res.json({message: "Category successfully added"});
        deleteImage(req.file.path)
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).send('Error adding category.');
    }
}
async function getEquip(id){
    try{
        return await Equipment.findById(id);
    }catch (error) {
        console.error(error);
        return null;
    }
}

async function getUser(id){
    try{
        const userId = typeof id === 'string' ? id : id.toString();
        return await User.findOne({_id: userId});
    }catch (error){
        console.error(error);
        return null;
   }
}
async function searchEquip(query, page){
    try{
        let limit = 6;
        let skip = (page - 1) * limit

        return await Equipment.find({
            $or: [
                { productName: { $regex: query, $options: 'i' } }, // Case-insensitive search for equipment name
                { description: { $regex: query, $options: 'i' } } // Case-insensitive search for equipment description
            ]
        }).skip(skip).limit(limit);
    } catch (e){
        console.error(e);
        return null;
    }
}
async function queryLen(query){
    try{
        const equips =  await Equipment.find({
            $or: [
                { productName: { $regex: query, $options: 'i' } }, // Case-insensitive search for equipment name
                { description: { $regex: query, $options: 'i' } } // Case-insensitive search for equipment description
            ]
        });
        return equips.length;
    } catch (e){
        console.error(e);
        return 0;
    }
}

async function updateEquip(req, res) {
    try {
        const equipId = req.params.id;
        const updateFields = {
            $set: {
                productName: req.body.productName,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                category: req.body.category,
            }
        };
        const result = await Equipment.updateOne({ _id: equipId }, updateFields);

        if (result.modifiedCount === 1) {
            res.send('Equipment updated successfully!');
        } else {
            res.status(404).send('Equipment not found or no changes were made.');
        }
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).send('Error updating equipment.');
    }
}
async function deleteEquip(req, res) {
    try {
        const equipId = req.params.id;
        const result = await Equipment.deleteOne({ _id: equipId });

        if (result.deletedCount === 1) {
            res.send('Equipment deleted successfully!');
        } else {
            res.status(404).send('Equipment not found.');
        }
    } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).send('Error deleting equipment.');
    }
}
async function readImageFromMongoDB(filename) {
    try {
        // Поиск документа изображения по имени файла
        const imageDoc = await Image.findOne({ filename: filename });

        // Проверка, был ли найден документ
        if (!imageDoc) {
            console.log('Изображение не найдено в MongoDB.');
            return null; // Возвращаем null, если изображение не найдено
        }

        // Чтение данных изображения из документа как Buffer
        const imageData = imageDoc.data;

        return imageData;
    } catch (error) {
        console.error('Произошла ошибка:', error);
        return null; // Возвращаем null в случае ошибки
    }
}
function deleteImage(filePath){
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Произошла ошибка при удалении файла:', err);
            return;
        }
        console.log('Файл успешно удален.');
    });
}
module.exports.deleteEquip = deleteEquip
module.exports.updateEquip = updateEquip
module.exports.addEquip = addEquip;
module.exports.getAllCategories = getAllCategories;
module.exports.getAllCategoriesWithImg = getAllCategoriesWithImg;
module.exports.getAllCategoriesWithEquip = getAllCategoriesWithEquip;
module.exports.getEquip = getEquip;
module.exports.addCategory = addCategory;
module.exports.addEquip = addEquip;
module.exports.getUser = getUser;
module.exports.searchEquip = searchEquip;
module.exports.queryLen = queryLen;
module.exports.readImageFromMongoDB = readImageFromMongoDB;
