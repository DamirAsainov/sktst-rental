const express = require('express');
const multer = require('multer');
const path = require('path');
const crudFunctions = require('./crud')

const app =  express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));


app.get('/', (req, res) => {
    res.render('index');
})
app.get('/add-equip', async (req, res) => {
    const titlesArray = await crudFunctions.getAllCategories();
    res.render('add-equip', {categories: titlesArray.map(document => document.title)})
})
app.get('/add-category', (req, res) => {
    res.render('add-category');
})
app.get('/test', async (req, res) => {
    const categories = await crudFunctions.getAllCategoriesWithImg();
    res.render('test', {categories: categories })
})
app.post('/add-category-db',upload.single('image'), async (req, res) =>{
    await crudFunctions.addCategory(req, res);
})
app.post('/add-equip-db', upload.single('image'), async (req, res) => {
    await crudFunctions.addEquip(req, res)
});
app.get('/uploads/:imgname',(req, res) =>{
    res.sendFile(__dirname + "/uploads/" + req.params.imgname)
});
app.get('/categories', async (req, res) => {
    const categories = await crudFunctions.getAllCategoriesWithImg();
    res.render('categories', {categories: categories });
});




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`)
});
