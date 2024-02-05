const express = require('express');
const multer = require('multer');
const path = require('path');
const crudFunctions = require('./crud')
const mongoose = require('mongoose');
const authCont = require('./authController');
const {check, cookie} = require('express-validator');
const cookieParser = require('cookie-parser')
const authMiddleware = require('./midldleware/authMiddleware')
const roleMiddleware = require('./midldleware/roleMiddleware')
const {login} = require("./authController");
const addTokenMiddleware = require('./midldleware/addTokenMiddleware')

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
app.use(express.json())
app.use(cookieParser())


app.get('/', addTokenMiddleware,async (req, res) => {
    const categories = await crudFunctions.getAllCategoriesWithEquip();
    res.render('index', {categories: categories, login: authCont.verifyUser(req)});
})
app.get('/add-equip', async (req, res) => {
    const titlesArray = await crudFunctions.getAllCategories();
    res.render('add-equip', {categories: titlesArray.map(document => document.title)})
})
app.get('/equip/:id', addTokenMiddleware,async (req, res) => {
    const equip = await crudFunctions.getEquip(req.params.id); // change
    if(equip == null){
        res.send('what???', 404);
    }else {
        res.render('concrete-equip', {eq: equip, login: authCont.verifyUser(req)});
    }
})
app.get('/add-category', (req, res) => {
    res.render('add-category');
})
app.get('/test', addTokenMiddleware, roleMiddleware(["USER"]), async (req, res) => {
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
app.get('/categories',addTokenMiddleware, async (req, res) => {
    const categories = await crudFunctions.getAllCategoriesWithImg();
    res.render('categories', {categories: categories , login: authCont.verifyUser(req)});
});
app.post('/registration', [check('username', 'Username can not be empty').notEmpty(),
        check('password', 'Password must be > 4 symbols < 20').isLength({min: 4, max: 20})],
        async (req, res)=>{
    await authCont.registration(req, res);
})
app.post('/login',async (req, res) =>{
    await authCont.login(req, res);
})
app.get('/log', (req, res) =>{
    res.render('login', {login: false})
})
app.post('/logout', (req, res) => {
    authCont.loguot(req,res);
})
app.get('/reg' ,(req, res) => {
    res.render('registration', {login: false})
});
app.get('/account', addTokenMiddleware, roleMiddleware("USER"), async (req, res) => {
    res.render('account', {login: true, user: await crudFunctions.getUser(authCont.getUserID(req))})
});



const PORT = 3000;
async function start(){
    await mongoose.connect("mongodb://localhost:27017/myProject")
    app.listen(PORT, () => {
        console.log(`Server started: http://localhost:${PORT}`)
    });
}
start();



