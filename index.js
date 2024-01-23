const express = require('express');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const path = require('path');


// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
// Database Name
const dbName = 'myProject';
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

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.render('index')
})
app.get('/add-equip', async(req, res) => {
    client.connect(); // vremeno
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('categories');
    const documents = await collection.find({}).toArray();
    console.log('All Categories', documents);
    const titlesArray = documents.map(document => document.title);
    res.render('add-equip', {categories: titlesArray})
})
app.get('/add-category', (req, res) => {
    res.render('add-category')
})
app.get('/test', async (req, res) => {  
    client.connect(); // vremeno
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('categories');
    const documents = await collection.find({}).toArray();
    console.log('All Categories', documents);
    const titlesArray = documents.map(document => document.title);  
    res.render('test', {categories: titlesArray })
})
app.post('/add-category-db', async (req, res) =>{
    try{
        await client.connect();
        const database = client.db(dbName);
        let collection = database.collection('categories');
        const result = await collection.insertOne({
            title: req.body.categoryTitle
        });

        console.log(`Category add with ID: ${result.insertedId}`);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).send('Error adding category.');
    } finally {
        await client.close();
    }
})
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        await client.connect();

        const database = client.db(dbName);
        let collection = database.collection('images');

        const result = await collection.insertOne({
            filename: req.file.filename,
            path: req.file.path
        });

        console.log(`File uploaded with ID: ${result.insertedId}`);
        console.log(req.body.productName);
        
        collection = database.collection('equipments');
        await collection.insertOne({
            productName: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            imageID: result.insertedId
        })
        res.send('File uploaded successfully!');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file.');
    } finally {
        await client.close();
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`)
})


async function databaseConnection() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('categories');
    const documents = await collection.find({}).toArray();

        // Print or use the documents
    console.log('All Categories', documents);

    // the following code examples can be pasted here...
    return 'done.';
  }
  
databaseConnection()